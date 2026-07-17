# Purple Cross Employee Dashboard

Nuxt 4 / Nuxt UI 4 assessment for the Purple Cross Ltd employee management case study.

The app replaces an Excel-based employee list with a centralized dashboard for searchable, sortable, pageable, editable employee records. It uses Nuxt server routes for the backend, Prisma/PostgreSQL for persistence, and shared Zod schemas for validation.

## Included

- Employee grid with search, department/status filtering, sorting, pagination, and row actions.
- Create and edit form with confidential HR fields.
- Delete action with confirmation.
- JSON export endpoint and JSON import endpoint.
- Prisma schema, migration, seed script, and bundled sample `purple_cross_employees.json`.
- Unit tests with coverage for shared employee logic, import parsing, and Nuxt UI components.
- Playwright smoke flow for the dashboard.
- Storybook 10 component catalog for dashboard and employee form components.
- Docker Compose, production Dockerfile, and Helm chart.

## Stack

- Nuxt 4 and Nitro server routes.
- Nuxt UI 4 and Tailwind CSS.
- Prisma 6 and PostgreSQL.
- npm workspaces and Turborepo.
- Vitest 4, Storybook 10, and Playwright.

## Quick Start

Prerequisite: Node.js 22.12 or newer.

```bash
npm install
cp .env.example .env
docker compose -f deploy/docker/docker-compose.yml up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev -- --filter @purple-cross/web
```

Open `http://localhost:3000/employees`.

## Verification

```bash
npm test
npm run coverage
npm run storybook:build
npm run build
npm run test:e2e
```

## API

- `GET /api/employees` with `search`, `department`, `status`, `sortBy`, `sortDirection`, `page`, and `pageSize` query params.
- `POST /api/employees` creates an employee.
- `GET /api/employees/:id` reads an employee.
- `PATCH /api/employees/:id` updates an employee.
- `DELETE /api/employees/:id` deletes an employee.
- `GET /api/employees/export` downloads JSON.
- `POST /api/employees/import` upserts JSON rows shaped like the supplied case-study data.

## Repository Target

This folder is self-contained and can be pushed as its own repository under the `and1rew132` organization.
