# Shireburn Platform Employee Management Guide

This is a standalone interview assessment repo for the Shireburn Platform employee management case study, using Purple Cross Ltd. as the client.

## Stack

- Workspace: npm workspaces with Turborepo.
- Runtime: Node.js 22.12 or newer is required by Nuxt 4.4.x.
- App: Nuxt 4 with the Nuxt 4 `app/`, `server/`, and `shared/` layout.
- UI: Nuxt UI 4 dashboard components and Tailwind CSS.
- Database: Prisma with PostgreSQL.
- Tests: Vitest 4 for unit/API-oriented tests with coverage and Playwright for E2E flows.
- Component review: Storybook 10 for Nuxt component stories.

## Layout

- `apps/web/` contains the Nuxt frontend and Nitro API routes.
- `apps/web/app/layouts/default.vue` uses Nuxt UI dashboard primitives (`UDashboardGroup`, `UDashboardSidebar`, and `UDashboardNavbar`) and renders page-configured floating actions.
- `packages/shared/` contains Zod schemas, DTOs, query types, and pure formatting/status helpers shared by the app, API, tests, and seed tools.
- `packages/db/` contains Prisma schema, client setup, repository helpers, import parsing, and seed tooling.
- `e2e/` contains Playwright browser tests.
- `deploy/docker/` contains local review and production container assets.
- `deploy/chart/` contains the Kubernetes Helm chart.
- `docs/` contains reviewer-facing architecture, testing, and deployment notes.

## Data Notes

- Employment status is derived from `dateOfEmployment` and `terminationDate` at read time; do not add it back as a persisted database column.
- Audit log storage was intentionally removed. Do not reintroduce audit writes unless the feature is implemented end to end.
- Sorting/filtering/pagination are server-side concerns in `packages/db/src/employeeRepository.ts`; keep shared package logic limited to schemas, DTO types, and pure reusable helpers.
- Demo authentication is client-side only through `useAuth`; do not treat it as production security.
- Floating actions are configured through typed Nuxt layout props in `definePageMeta({ layout: { name: 'default', props: { floatingActions: [...] } } })` and connected to runtime handlers through `useFloatingActions`.

## Commands

Run commands from this project root.

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
npm test
npm run coverage
npm run storybook:build
npm run build
```

Use `docker compose -f deploy/docker/docker-compose.yml up -d postgres` for local PostgreSQL.
Use `docker compose -f deploy/docker/docker-compose.yml --profile app up -d --build employee-management-web` to run the Nuxt app in a bind-mounted dev container.
Use `docker compose -f deploy/docker/docker-compose.yml --profile storybook up -d --build storybook` to run Storybook in a bind-mounted dev container. Source changes are live-mounted; rebuild only when the dev Dockerfile or base dependencies change.

For E2E against the Docker app, pass the running app URL when it is not on port `3000`:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npm run test:e2e
```

## Operational Notes

- Do not commit real secrets. `DATABASE_URL` and `SESSION_SECRET` must come from the environment or deployment secrets.
- Do not commit personal/local Traefik hosts. Put machine-specific host values in an uncommitted `.env` file or shell environment.
- Keep the provided `purple_cross_employees.json` in the repo root so the submission is self-contained.
- If build, test, deployment, database, or local Docker commands change, update this file in the same change.
