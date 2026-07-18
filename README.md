# Shireburn Platform - Employee Management

Nuxt 4 / Nuxt UI 4 assessment for Shireburn Platform Employee Management, configured with Purple Cross Ltd. as the client dataset.

The module replaces an Excel-based employee list with a centralized dashboard for searchable, sortable, pageable, editable employee records. It uses Nuxt server routes for the backend, Prisma/PostgreSQL for persistence, and shared Zod schemas for validation. Employment status is derived from employment dates at read time rather than stored in the database, so status remains deterministic as dates move past today.

## Included

- Employee grid with server-side search, department/status filtering, sorting, pagination, and row actions.
- Create and edit form with confidential HR fields.
- Delete action with confirmation.
- JSON export endpoint and JSON import endpoint.
- Prisma schema, migrations, seed script, and bundled sample `purple_cross_employees.json`.
- Nuxt UI dashboard shell with sidebar, navbar, and logged-in user badge.
- Unit tests with coverage for shared employee logic, import parsing, and Nuxt UI components.
- Playwright smoke flow for desktop and mobile dashboard behavior.
- Storybook 10 component catalog for dashboard and employee form components.
- Docker Compose dev containers, production Dockerfile, and Helm chart.

## Stack

- Nuxt 4 and Nitro server routes.
- Nuxt UI 4 dashboard components and Tailwind CSS.
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

## Docker Dev

The compose file uses bind-mounted dev containers for the Nuxt app and Storybook. Source changes are live-mounted; rebuild only when dependencies or Dockerfile inputs change.

```bash
docker compose -f deploy/docker/docker-compose.yml --profile app up -d --build employee-management-web
docker compose -f deploy/docker/docker-compose.yml --profile storybook up -d --build storybook
```

Local defaults:

- App: `http://localhost:3000/employees`
- Storybook: `http://localhost:6006`
- PostgreSQL: `localhost:5434`

For local Traefik routing, set host variables in your shell or uncommitted `.env` file, for example:

```bash
TRAEFIK_HOST=shireburn.localhost \
STORYBOOK_TRAEFIK_HOST=shireburn-storybook.localhost \
TRAEFIK_ENTRYPOINTS=websecure \
TRAEFIK_TLS=true \
WEB_PORT=3012 \
STORYBOOK_PORT=6016 \
docker compose -f deploy/docker/docker-compose.yml --profile app --profile storybook up -d --build
```

## Verification

```bash
npm test
npm run coverage
npm run storybook:build
npm run build
npm run test:e2e
```

When testing against the Docker app on a non-default port, pass the running app URL:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npm run test:e2e
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
