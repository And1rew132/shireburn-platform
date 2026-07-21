# Architecture

The assessment is intentionally a single deployable Nuxt application. Nuxt owns the frontend and Nitro server routes, which keeps the case-study deployment small while still exercising backend design, validation, database access, and browser behavior.

## Boundaries

- [`apps/employee-management/app`](../apps/employee-management/app) contains layouts, pages, composables, and dashboard components.
- [`apps/employee-management/server/api`](../apps/employee-management/server/api) exposes the employee HTTP API.
- [`packages/shared`](../packages/shared) contains DTOs, Zod schemas, query types, and pure helpers used on both sides.
- [`packages/db`](../packages/db) contains Prisma, repository methods, import parsing, and seed tooling.

API handlers stay thin. They parse route/query/body inputs and delegate persistence work to `packages/db`.

## Data Model

[`Employee`](../packages/db/prisma/schema.prisma) keeps the supplied case-study fields and adds confidential HR fields to make the edit workflow realistic: national ID, salary, emergency contact, and confidential notes. Employment status is derived from employment dates at read time so it stays deterministic as dates move past today.

Status is derived from employment and termination dates:

- `ACTIVE`: started and not terminated before today.
- `FUTURE`: employment date is after today.
- `TERMINATED`: termination date is before today.

Status is not persisted in PostgreSQL. Server-side status filtering is translated into date predicates, and status sorting derives statuses before pagination.

## UI

The default layout in [`apps/employee-management/app/layouts/default.vue`](../apps/employee-management/app/layouts/default.vue) uses Nuxt UI dashboard primitives: `UDashboardGroup` for the shell, `UDashboardSidebar` for desktop navigation and the mobile drawer, and `UDashboardNavbar` for the app bar. It also renders a reusable floating action dial from typed layout props supplied by each page. The employee page is the first product screen, with dense operational controls instead of a landing page.

The Shireburn Platform is the product brand. Purple Cross Ltd. is represented as the active client context.

## Authentication

The login flow is a demo gate for the assessment. [`useAuth`](../apps/employee-management/app/composables/useAuth.ts) stores a local session cookie, global route middleware redirects unauthenticated protected pages to `/login`, and the dashboard navbar exposes logout. Real deployments should replace this with server-backed authentication.

## Component Catalog

Storybook covers reusable dashboard components and the employee form drawer so reviewers can inspect component states independently from seeded API data.

## API Routes

The employee API lives in [`apps/employee-management/server/api/employees`](../apps/employee-management/server/api/employees):

- `GET /api/employees` lists records with `search`, `department`, `status`, `sortBy`, `sortDirection`, `page`, and `pageSize`.
- `POST /api/employees` creates a record.
- `GET /api/employees/:id` reads one record.
- `PATCH /api/employees/:id` updates one record.
- `DELETE /api/employees/:id` deletes one record.
- `GET /api/employees/export` downloads JSON.
- `POST /api/employees/import` upserts rows shaped like the supplied Purple Cross data.

See [Testing](testing.md#e2e-tests) for the browser path that exercises the main API-backed workflow.
