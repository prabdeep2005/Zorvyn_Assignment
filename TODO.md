# Project Todo List - Finance Data Processing Backend

Based on the [plan.md](docs/plan.md), here is the implementation roadmap.

## phase 1: Foundation & Modern Stack (Bun + Docker)
- [x] Initialize project with **Bun** (`bun init -y`)
- [x] Set up **Docker** & **Docker Compose**:
    - [x] Create `Dockerfile` (Multi-stage for Bun)
    - [x] Create `docker-compose.yml` (Postgres + Bun API)
- [x] Set up **ElysiaJS** for high-performance API routing (with Swagger)
- [ ] Set up **Drizzle ORM** for type-safe database access
- [ ] Define Database Schema (Postgres):
    - [ ] **User**: id, name, email, role, status (active/inactive)
    - [ ] **FinancialRecord**: id, userId, amount, type (income/expense), category, date, notes
- [x] Implement basic error handling middleware and validation utility
- [x] Set up **Biome** for 2026-standard Linting & Formatting

## phase 2: User & Access Control
- [ ] Implement User Management APIs (using Elysia handler patterns):
    - [ ] Create user
    - [ ] Update user status/role
    - [ ] List users
- [ ] Implement Role-Based Access Control (RBAC) Middleware:
    - [ ] Viewer Guard (Read-only)
    - [ ] Analyst Guard (Read + Analytics)
    - [ ] Admin Guard (Full Access)
- [ ] Use **Bun.password** for secure hashing

## phase 3: Financial Records Management
- [ ] Implement Financial Record CRUD:
    - [ ] Create record
    - [ ] Read record(s)
    - [ ] Update record
    - [ ] Delete record
- [ ] Implement Filtering Logic:
    - [ ] Date range filtering
    - [ ] Category filtering
    - [ ] Type filtering (income/expense)

## phase 4: Dashboard & Analytics APIs
- [ ] Implement Aggregation APIs:
    - [ ] Total income/expenses/net balance
    - [ ] Category-wise totals
    - [ ] Trends (weekly/monthly)
    - [ ] Recent activity feed
- [ ] Ensure specific access for Analyst/Admin roles only

## phase 5: Polish & Excellence
- [ ] Add Input Validation using **Elysia + TypeBox** (standard for Bun)
- [ ] Implement Pagination & Search for records
- [ ] Add Soft Deletes for financial records
- [ ] Write Unit/Integration Tests using **Bun:test**
- [ ] Generate API Documentation (Swagger via Elysia-Swagger)

## phase 6: Finalization
- [ ] Perform manual API testing and edge case validation
- [ ] Complete `README.md` with:
    - [ ] Setup instructions
    - [ ] Architecture overview
    - [ ] Assumptions made
    - [ ] Design decisions
