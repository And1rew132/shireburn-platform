# Purple Cross Employee Dashboard Guide

This is a standalone interview assessment repo for the Shireburn Purple Cross Ltd case study.

## Stack

- Workspace: npm workspaces with Turborepo.
- Runtime: Node.js 22.12 or newer is required by Nuxt 4.4.x.
- App: Nuxt 4 with the Nuxt 4 `app/`, `server/`, and `shared/` layout.
- UI: Nuxt UI 4 and Tailwind CSS.
- Database: Prisma with PostgreSQL.
- Tests: Vitest 4 for unit/API-oriented tests with coverage and Playwright for E2E flows.
- Component review: Storybook 10 for Nuxt component stories.

## Layout

- `apps/web/` contains the Nuxt frontend and Nitro API routes.
- `packages/shared/` contains Zod schemas, DTOs, and pure employee helpers shared by the app, API, tests, and seed tools.
- `packages/db/` contains Prisma schema, client setup, repository helpers, and seed/import tooling.
- `e2e/` contains Playwright browser tests.
- `deploy/docker/` contains local review and production container assets.
- `deploy/chart/` contains the Kubernetes Helm chart.
- `docs/` contains reviewer-facing architecture, testing, and deployment notes.

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

## Operational Notes

- Do not commit real secrets. `DATABASE_URL` and `SESSION_SECRET` must come from the environment or deployment secrets.
- Keep the provided `purple_cross_employees.json` in the repo root so the submission is self-contained.
- If build, test, deployment, or database commands change, update this file in the same change.
