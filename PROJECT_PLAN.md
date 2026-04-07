# LifelongEduPortal Project Plan

## 1. Project Summary

- Project name: `LifelongEduPortal`
- Current form: web-based lifelong education and local welfare information portal
- Product type: public-facing content portal with a prototype institution dashboard
- Tech stack observed in the repository: `React + Vite + TypeScript`, `Express + TypeScript`, `Wouter`, `TanStack Query`, `Tailwind`, `Drizzle`

This project appears to be a regional lifelong education discovery platform focused on seniors and local residents. The current repository combines service UI, institution/course datasets, achievement-book archives, and data-processing scripts in a single product workspace.

## 2. Intended Service Direction

The service should help users find and access lifelong learning opportunities without needing to search multiple municipal, welfare, and institution sites individually.

The product direction implied by the codebase is:

1. Provide easy discovery of online lectures.
2. Provide local welfare and lifelong-learning program information by region.
3. Provide institution search and detail pages.
4. Provide Damoa-style course listings and application-entry guidance.
5. Provide performance/achievement resources such as annual reports and best-practice cases.
6. Reserve space for institution-side operational dashboards.

## 3. Core Target Users

### Primary

- Seniors who need simple, guided access to education and welfare programs
- Local residents searching for nearby lifelong-learning institutions or courses

### Secondary

- Public officials or coordinators managing local lifelong-learning programs
- Partner institutions that want a unified visibility channel
- Researchers or stakeholders reviewing achievement books and best-practice materials

## 4. Problem Definition

The repository structure suggests the service is solving these problems:

- Learning and welfare information is fragmented across regions and institutions.
- Older users need simpler navigation than typical government or institution sites provide.
- Regional institution information is hard to compare in one place.
- Annual outcomes, media, and best practices are usually stored separately from service discovery.
- Data from CSV/XLSX/PDF sources needs manual processing before it becomes usable on the web.

## 5. Current Product Scope Found in the Folder

### Public service areas

- Home landing page
- Online lecture list and detail
- Local program list and detail
- Lifelong-learning institution list and detail
- Damoa-style course listing
- Contest/resources/performance sections
- Application submission page

### Internal or prototype admin area

- Dashboard shell with menu for logs, attendance, reports, and settings

### Data and asset layer

- Region-based JSON data for institutions
- TypeScript mock data for online lectures and local programs
- Source CSV/XLSX/PDF/image assets under `attached_assets/`
- Data processing scripts under `script/`

### Backend state

- Express server exists, but `server/routes.ts` is effectively empty
- Shared schema only defines a basic `users` table
- In practice, the service currently behaves mostly like a static-data SPA with a thin server wrapper

## 6. Key Features to Define in the Plan

### A. Learning discovery

- Search online lectures by topic, difficulty, platform, and usefulness
- Browse local programs by region, schedule, target audience, and operation type
- View course details with eligibility, schedule, fee, and application method

### B. Institution discovery

- Search institutions by region, keyword, address, and tags
- Provide grid/list/map views
- Show institution detail pages with contact info, programs, facilities, and location

### C. Archive and trust content

- Achievement books by year
- Best-practice case studies
- Media/resources pages for policy communication and service credibility

### D. Institution-facing functions

- Dashboard for attendance, operations log, reporting, and settings
- This is currently conceptual UI and should be treated as phase-2 functionality

## 7. Recommended Product Positioning

Recommended positioning:

`A senior-friendly lifelong education and local welfare discovery portal that integrates institutions, programs, and performance resources into one searchable experience.`

This positioning fits the current repository better than calling it a full transaction platform, because the actual backend workflow and application APIs are not implemented yet.

## 8. Information Architecture

Recommended IA based on the existing pages:

1. Home
2. Online Learning
3. Local Programs
4. Institutions
5. Damoa Courses
6. Application Guide / Submission
7. Performance
8. Resources
9. Admin Dashboard

This structure is already mostly present in the routing and should be standardized rather than expanded further.

## 9. Data Strategy

### Current state

- Raw source files are stored in the repository
- Processed JSON is partly committed directly into the app
- Some regional data is embedded as mock data inside page components
- The backend is not yet the source of truth

### Recommended target state

1. Move all institution, lecture, and program data into a normalized database.
2. Use `script/` only for import and transformation pipelines.
3. Expose filtered search APIs from Express.
4. Keep static assets in `client/public` and source uploads outside the app path where possible.
5. Separate source data, processed data, and published app data clearly.

## 10. Execution Roadmap

### Phase 1. Stabilize the prototype

- Clean broken text encoding issues visible in UI/source data
- Standardize page labels, navigation, and Korean copy
- Remove hard-coded mock objects from page components
- Consolidate institution and program data formats
- Document actual service scope and operating assumptions

### Phase 2. Build real data services

- Design DB schema for institutions, courses, programs, regions, assets, and reports
- Implement `/api` routes for listing, filtering, and detail retrieval
- Replace direct local imports with API-backed fetching
- Add admin-auth and role handling if the dashboard remains in scope

### Phase 3. Complete user flows

- Add real course application and inquiry flows
- Add favorites, recent views, and accessibility-oriented guidance
- Add map integration and location-based search
- Add content management workflow for institutions and reports

### Phase 4. Operations and quality

- Add analytics, logging, and audit history
- Add testing for data parsing, routing, and key UI journeys
- Add deployment, environment config, and backup policies

## 11. KPI Suggestions

- Monthly active users searching for programs
- Click-through rate from list pages to detail pages
- External application link click rate
- Number of searchable institutions by region
- Number of programs updated per month
- Achievement-book and resource download count
- Accessibility task completion rate for senior users

## 12. Risks Identified from the Repository

- Korean text appears broken in several files or console output, indicating encoding inconsistency
- Public pages and admin pages are mixed in one product without a clear permissions model
- Server layer is largely unimplemented, so scalability is limited
- Large raw assets are committed directly into the repository
- Data model is not yet unified across institutions, local programs, and course listings
- Detail pages still rely on placeholder data in places

## 13. Recommended Immediate Next Actions

1. Finalize one product definition: portal first, admin second.
2. Fix encoding and content quality before adding more screens.
3. Extract all embedded mock data into a shared structured source.
4. Design the real schema and API contract.
5. Decide whether the dashboard is in MVP or post-MVP.
6. Create a lightweight CMS or ingestion workflow for regional updates.

## 14. One-Line Planning Statement

`LifelongEduPortal` should be developed first as a trusted, senior-friendly discovery portal for lifelong education and local welfare information, then expanded into a data-backed operational platform for participating institutions.
