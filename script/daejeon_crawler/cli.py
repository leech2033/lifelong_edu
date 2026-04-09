from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from .browser import fetch_with_browser
from .dedupe import dedupe_candidates
from .enrich import apply_enrich_seeds_to_json_rows, apply_enrich_seeds_to_masters
from .http import fetch_source, should_use_browser_fallback
from .normalize import normalize_candidate
from .parsers import get_parser
from .quality import build_review_queue
from .registry_loader import filter_sources, load_registry
from .settings import PARSED_DIR, ensure_output_dirs
from .storage import (
    clear_staging_tables,
    connect_db,
    export_json,
    init_db,
    load_all_candidates,
    replace_master_rows,
    write_candidates,
    write_raw_documents,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Daejeon lifelong education crawler")
    subparsers = parser.add_subparsers(dest="command", required=True)

    crawl = subparsers.add_parser("crawl", help="Fetch and parse sources")
    crawl.add_argument("--source", help="Single source_id to crawl")
    crawl.add_argument("--scope", help="coverage_level or region_scope filter")
    crawl.add_argument("--registry", help="Custom registry file path")
    crawl.add_argument(
        "--browser-fallback",
        action="store_true",
        help="Retry failed or JS-heavy sources with Playwright",
    )
    crawl.add_argument(
        "--reset",
        action="store_true",
        help="Clear staging tables before crawling",
    )
    source_export = subparsers.add_parser(
        "source-export",
        help="Fetch one source and export deduped rows to a JSON file",
    )
    source_export.add_argument("--source", required=True, help="Single source_id to crawl")
    source_export.add_argument("--registry", help="Custom registry file path")
    source_export.add_argument(
        "--browser-fallback",
        action="store_true",
        help="Retry failed or JS-heavy sources with Playwright",
    )
    source_export.add_argument("--output", required=True, help="Output JSON file name")
    pipeline = subparsers.add_parser(
        "pipeline",
        help="Run crawl, dedupe, review-report, and seed-curated in sequence",
    )
    pipeline.add_argument("--source", help="Single source_id to crawl")
    pipeline.add_argument("--scope", help="coverage_level or region_scope filter")
    pipeline.add_argument("--registry", help="Custom registry file path")
    pipeline.add_argument(
        "--browser-fallback",
        action="store_true",
        help="Retry failed or JS-heavy sources with Playwright",
    )
    pipeline.add_argument(
        "--reset",
        action="store_true",
        help="Clear staging tables before crawling",
    )

    subparsers.add_parser("normalize", help="Normalize existing candidates in sqlite")
    subparsers.add_parser("dedupe", help="Build master institutions from candidates")
    subparsers.add_parser("review-report", help="Build review queue JSON")
    seed_curated = subparsers.add_parser(
        "seed-curated",
        help="Apply enrich seeds to curated JSON files",
    )
    seed_curated.add_argument(
        "--inputs",
        nargs="*",
        default=[
            "institutions_master_curated.json",
            "institutions_master_curated_b.json",
            "institutions_master_latest.json",
        ],
        help="Parsed JSON files to update in place",
    )

    export = subparsers.add_parser("export", help="Export current DB state to JSON")
    export.add_argument("--name", default="institutions_master.json", help="Output file name")
    return parser


def run_crawl(args: argparse.Namespace) -> None:
    ensure_output_dirs()
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    sources = filter_sources(load_registry(args.registry), args.source, args.scope)
    if not sources:
        raise SystemExit("No sources matched the given filter.")

    connection = connect_db()
    init_db(connection)
    if args.reset:
        clear_staging_tables(connection)

    raw_documents = []
    candidates = []
    for source in sources:
        raw = fetch_source(source, run_id=run_id)
        if args.browser_fallback and should_use_browser_fallback(source, raw):
            browser_raw = fetch_with_browser(source, run_id=run_id)
            raw_documents.append(raw)
            raw = browser_raw
        raw_documents.append(raw)
        if raw.error_message or not raw.text_content:
            continue
        parser = get_parser(source.parser_family)
        parsed = [normalize_candidate(item) for item in parser.parse(source, raw)]
        candidates.extend(parsed)

    write_raw_documents(connection, raw_documents)
    write_candidates(connection, candidates)
    export_json("crawl_candidates.json", [item.to_dict() for item in candidates])
    print(
        json.dumps(
            {
                "run_id": run_id,
                "source_count": len(sources),
                "raw_document_count": len(raw_documents),
                "candidate_count": len(candidates),
            },
            ensure_ascii=False,
        )
    )


def run_normalize() -> None:
    connection = connect_db()
    init_db(connection)
    candidates = [normalize_candidate(item) for item in load_all_candidates(connection)]
    export_json("normalized_candidates.json", [item.to_dict() for item in candidates])
    print(json.dumps({"candidate_count": len(candidates)}, ensure_ascii=False))


def run_source_export(args: argparse.Namespace) -> None:
    ensure_output_dirs()
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    sources = filter_sources(load_registry(args.registry), args.source, None)
    if not sources:
        raise SystemExit("No sources matched the given filter.")

    source = sources[0]
    raw = fetch_source(source, run_id=run_id)
    if args.browser_fallback and should_use_browser_fallback(source, raw):
        raw = fetch_with_browser(source, run_id=run_id)
    if raw.error_message or not raw.text_content:
        raise SystemExit(raw.error_message or "Empty response")

    parser = get_parser(source.parser_family)
    candidates = [normalize_candidate(item) for item in parser.parse(source, raw)]
    masters = apply_enrich_seeds_to_masters(dedupe_candidates(candidates))
    export_path = export_json(args.output, [item.to_dict() for item in masters])
    print(
        json.dumps(
            {
                "source_id": source.source_id,
                "candidate_count": len(candidates),
                "master_count": len(masters),
                "output_path": str(export_path),
            },
            ensure_ascii=False,
        )
    )


def run_dedupe() -> None:
    connection = connect_db()
    init_db(connection)
    candidates = [normalize_candidate(item) for item in load_all_candidates(connection)]
    masters = apply_enrich_seeds_to_masters(dedupe_candidates(candidates))
    replace_master_rows(connection, masters)
    export_json("institutions_master.json", [item.to_dict() for item in masters])
    print(json.dumps({"master_count": len(masters)}, ensure_ascii=False))


def run_review_report() -> None:
    connection = connect_db()
    init_db(connection)
    candidates = [normalize_candidate(item) for item in load_all_candidates(connection)]
    masters = apply_enrich_seeds_to_masters(dedupe_candidates(candidates))
    review_items = build_review_queue(candidates, masters)
    export_json("review_queue.json", review_items)
    print(json.dumps({"review_count": len(review_items)}, ensure_ascii=False))


def run_seed_curated(inputs: list[str]) -> None:
    updated: list[str] = []
    for name in inputs:
        path = Path(name)
        if not path.is_absolute():
            path = PARSED_DIR / name
        if not path.exists():
            continue
        rows = json.loads(path.read_text(encoding="utf-8"))
        seeded = apply_enrich_seeds_to_json_rows(rows)
        path.write_text(json.dumps(seeded, ensure_ascii=False, indent=2), encoding="utf-8")
        updated.append(str(path))
    print(json.dumps({"updated_files": updated}, ensure_ascii=False))


def run_pipeline(args: argparse.Namespace) -> None:
    run_crawl(args)
    run_dedupe()
    run_review_report()
    run_seed_curated(
        [
            "institutions_master_curated.json",
            "institutions_master_curated_b.json",
            "institutions_master_latest.json",
        ]
    )


def run_export(name: str) -> None:
    connection = connect_db()
    rows = connection.execute("select * from institutions_master").fetchall()
    payload = [dict(row) for row in rows]
    path = export_json(name, payload)
    print(json.dumps({"export_path": str(path), "row_count": len(payload)}, ensure_ascii=False))


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    if args.command == "crawl":
        run_crawl(args)
        return
    if args.command == "pipeline":
        run_pipeline(args)
        return
    if args.command == "normalize":
        run_normalize()
        return
    if args.command == "source-export":
        run_source_export(args)
        return
    if args.command == "dedupe":
        run_dedupe()
        return
    if args.command == "review-report":
        run_review_report()
        return
    if args.command == "seed-curated":
        run_seed_curated(args.inputs)
        return
    if args.command == "export":
        run_export(args.name)
        return
    raise SystemExit(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    main()
