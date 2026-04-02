# Finance Data Processing Backend

A high-performance finance management API built with **Bun**, **ElysiaJS**, **Drizzle ORM**, and **PostgreSQL**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Bun](https://bun.sh) |
| Framework | [ElysiaJS](https://elysiajs.com) |
| Database | PostgreSQL 17 (via Docker) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Validation | TypeBox (built into Elysia) |
| Linting | [Biome](https://biomejs.dev) |
| Docs | Swagger (via `@elysiajs/swagger`) |

---

## Setup

### Prerequisites
- [Bun](https://bun.sh) `>= 1.1`
- [Docker & Docker Compose](https://docs.docker.com/compose/)

### 1. Clone and install dependencies

```bash
git clone https://github.com/prabdeep2005/Zorvyn_Assignment.git
cd Zorvyn_Assignment
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — defaults work with Docker Compose
```

### 3. Start the database

```bash
docker compose up -d db
```

### 4. Push schema to database

```bash
bun run db:push
```

### 5. Start the API server

```bash
bun run dev
```

The server starts at **http://localhost:3000**  
Swagger docs at **http://localhost:3000/swagger**

### Run with Docker (full stack)

```bash
docker compose up --build
```

---

## API Overview

All protected routes require the `x-user-role` header (mock auth — see [Assumptions](#assumptions)).

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/status` | Health check + DB connectivity |

### Users (`/users`)
| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/users` | analyst, admin | List all users |
| GET | `/users/:id` | analyst, admin | Get user by ID |
| POST | `/users` | admin | Create user |
| PATCH | `/users/:id` | admin | Update role or status |
| DELETE | `/users/:id` | admin | Delete user |

### Financial Records (`/records`)
| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/records` | viewer+ | List records (paginated, filterable) |
| GET | `/records/:id` | viewer+ | Get record by ID |
| POST | `/records` | admin | Create record |
| PATCH | `/records/:id` | admin | Update record |
| DELETE | `/records/:id` | admin | Delete record |

**Filtering query params:** `type`, `category`, `userId`, `dateFrom`, `dateTo`, `page`, `limit`

### Dashboard (`/dashboard`)
| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/dashboard/summary` | analyst+ | Total income, expenses, net balance |
| GET | `/dashboard/categories` | analyst+ | Category-wise breakdown |
| GET | `/dashboard/trends?period=monthly\|weekly` | analyst+ | Aggregated trends |
| GET | `/dashboard/recent` | analyst+ | Last 10 transactions with user info |

---

## Role-Based Access Control

| Role | Users | Records | Dashboard |
|------|-------|---------|-----------|
| **viewer** | ❌ | Read | ❌ |
| **analyst** | Read | Read | ✅ |
| **admin** | Full | Full | ✅ |

---

## Running Tests

> Requires the server to be running on port 3000 with a connected DB.

```bash
bun test
```

---

## Assumptions

1. **Mock Authentication**: Authentication uses a custom `x-user-role` HTTP header rather than JWT, to keep the focus on RBAC logic and data modeling. A real system would verify a JWT and extract the role from its payload.

2. **Admin-only Writes**: Only admins can create/update/delete users and records. This prevents data corruption from less-privileged roles.

3. **Soft Deletes skipped**: Hard deletes are used for simplicity. A production system would add a `deleted_at` timestamp column for soft deletes.

4. **Amount as `decimal`**: Financial amounts are stored as `numeric(15,2)` in Postgres for precision, avoiding floating-point issues.

5. **No authentication endpoint**: There is no `/login` route. The focus is on structure, RBAC, and data correctness as per the assignment spec.

---

## Design Decisions

- **Bun over Node**: Faster startup, built-in TypeScript support, and a native test runner.
- **ElysiaJS over Express/Fastify**: End-to-end type safety via Eden, TypeBox schema validation baked in, and first-class Bun support.
- **Drizzle over Prisma**: Lighter weight, generates plain SQL, and has better compatibility with Bun's module system.
- **`x-user-role` guard pattern**: Keeps the `roleGuard` reusable as a plain object spread, compatible with how ElysiaJS merges options.
- **Pagination on records**: Prevents large table scans — default 20 records per page.
- **Schema Push (Zero Migrations)**: Used `drizzle-kit push` for straightforward schema synchronization during the development phase, as allowed by the flexible assignment requirements.
