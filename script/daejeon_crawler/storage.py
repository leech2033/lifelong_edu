from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Iterable

from .models import InstitutionCandidate, MasterInstitution, RawDocument
from .settings import DB_PATH, PARSED_DIR, ensure_output_dirs


def connect_db() -> sqlite3.Connection:
    ensure_output_dirs()
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        create table if not exists raw_documents (
          run_id text not null,
          source_id text not null,
          fetched_at text not null,
          url text not null,
          fetch_method text not null,
          http_status integer,
          content_type text,
          encoding text,
          body_path text,
          body_sha256 text,
          text_content text,
          attachment_urls text,
          error_message text
        );

        create table if not exists institution_candidates (
          run_id text not null,
          source_id text not null,
          source_url text not null,
          raw_name text not null,
          canonical_name text,
          institution_type text,
          operator_name text,
          homepage_url text,
          phone text,
          address text,
          sido text,
          sigungu text,
          eupmyeondong text,
          operation_status text,
          recent_activity_date text,
          confidence_score real,
          extraction_notes text
        );

        create table if not exists institutions_master (
          institution_id text primary key,
          canonical_name text not null,
          display_name text not null,
          institution_type text not null,
          operator_name text,
          homepage_url text,
          phone text,
          road_address text,
          sido text not null,
          sigungu text,
          eupmyeondong text,
          operation_status text not null,
          confidence_score real not null,
          source_count integer not null,
          source_ids text not null,
          last_crawled_at text not null,
          last_verified_at text
        );
        """
    )
    connection.commit()


def clear_staging_tables(connection: sqlite3.Connection) -> None:
    connection.execute("delete from raw_documents")
    connection.execute("delete from institution_candidates")
    connection.commit()


def write_raw_documents(connection: sqlite3.Connection, docs: Iterable[RawDocument]) -> None:
    connection.executemany(
        """
        insert into raw_documents values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                doc.run_id,
                doc.source_id,
                doc.fetched_at,
                doc.url,
                doc.fetch_method,
                doc.http_status,
                doc.content_type,
                doc.encoding,
                doc.body_path,
                doc.body_sha256,
                doc.text_content,
                json.dumps(doc.attachment_urls, ensure_ascii=False),
                doc.error_message,
            )
            for doc in docs
        ],
    )
    connection.commit()


def write_candidates(
    connection: sqlite3.Connection, candidates: Iterable[InstitutionCandidate]
) -> None:
    connection.executemany(
        """
        insert into institution_candidates values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                item.run_id,
                item.source_id,
                item.source_url,
                item.raw_name,
                item.canonical_name,
                item.institution_type,
                item.operator_name,
                item.homepage_url,
                item.phone,
                item.address,
                item.sido,
                item.sigungu,
                item.eupmyeondong,
                item.operation_status,
                item.recent_activity_date,
                item.confidence_score,
                item.extraction_notes,
            )
            for item in candidates
        ],
    )
    connection.commit()


def replace_master_rows(connection: sqlite3.Connection, masters: Iterable[MasterInstitution]) -> None:
    connection.execute("delete from institutions_master")
    connection.executemany(
        """
        insert into institutions_master values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                item.institution_id,
                item.canonical_name,
                item.display_name,
                item.institution_type,
                item.operator_name,
                item.homepage_url,
                item.phone,
                item.road_address,
                item.sido,
                item.sigungu,
                item.eupmyeondong,
                item.operation_status,
                item.confidence_score,
                item.source_count,
                json.dumps(item.source_ids, ensure_ascii=False),
                item.last_crawled_at,
                item.last_verified_at,
            )
            for item in masters
        ],
    )
    connection.commit()


def export_json(name: str, payload: object) -> Path:
    ensure_output_dirs()
    path = PARSED_DIR / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def load_all_candidates(connection: sqlite3.Connection) -> list[InstitutionCandidate]:
    rows = connection.execute("select * from institution_candidates").fetchall()
    return [InstitutionCandidate(**dict(row)) for row in rows]
