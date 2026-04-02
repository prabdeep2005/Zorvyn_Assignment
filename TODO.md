# Project Todo List - Finance Data Processing Backend

## phase 1: Foundation & Modern Stack
- [x] Initialize project with **Bun**
- [x] Set up **Docker** & **Docker Compose** (Postgres 17 + Bun API)
- [x] Set up **ElysiaJS** with Swagger docs
- [x] Set up **Drizzle ORM** with type-safe DB access
- [x] Define Database Schema: `users`, `financial_records` (enums, FK, constraints)
- [x] Push schema to Postgres via `bun run db:push`
- [x] Implement error handling middleware (`src/utils/errors.ts`)
- [x] Set up **Biome** linting & formatting

## phase 2: User & Access Control
- [x] Implement User Management APIs:
    - [x] `GET /users` — list users (analyst+)
    - [x] `GET /users/:id` — get user by ID (analyst+)
    - [x] `POST /users` — create user (admin only)
    - [x] `PATCH /users/:id` — update role/status (admin only)
    - [x] `DELETE /users/:id` — remove user (admin only)
- [x] Implement RBAC Middleware (`src/auth/guards.ts`):
    - [x] `viewerGuard` — read-only records access
    - [x] `analystGuard` — read + analytics access
    - [x] `adminGuard` — full access

## phase 3: Financial Records Management
- [x] Implement Financial Record CRUD (`src/controllers/records.ts`):
    - [x] `POST /records` — create record
    - [x] `GET /records` — list with pagination
    - [x] `GET /records/:id` — get by ID
    - [x] `PATCH /records/:id` — update record
    - [x] `DELETE /records/:id` — delete record
- [x] Implement Filtering:
    - [x] Date range (`dateFrom`, `dateTo`)
    - [x] Category (`category`)
    - [x] Type (`income` / `expense`)
    - [x] User (`userId`)
- [x] Pagination (`page`, `limit`) with total count metadata

## phase 4: Dashboard & Analytics APIs
- [x] `GET /dashboard/summary` — total income, expenses, net balance
- [x] `GET /dashboard/categories` — category-wise totals by type
- [x] `GET /dashboard/trends?period=monthly|weekly` — time-bucketed aggregations
- [x] `GET /dashboard/recent` — last 10 transactions with user info (JOIN)
- [x] Analyst/Admin-only access enforced

## phase 5: Polish & Excellence
- [x] Input Validation via **Elysia + TypeBox** on all routes
- [x] Pagination & search for records
- [x] Integration Tests via **bun:test** (`tests/api.test.ts`)
- [x] Swagger docs with tags and metadata

## phase 6: Finalization
- [x] `README.md` complete:
    - [x] Setup instructions
    - [x] Architecture overview
    - [x] Assumptions documented
    - [x] Design decisions documented
- [x] Manual API testing & edge case validation
