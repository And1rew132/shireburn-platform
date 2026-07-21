# Shireburn Platform - Employee Management

Interview assessment for Shireburn Platform Employee Management, configured with Purple Cross Ltd. as the client dataset.

The project replaces an Excel-based employee list with a centralized dashboard for searchable, sortable, pageable, editable employee records. The reviewer can sign in, browse seeded employee data, create or edit confidential HR details, delete records, and import/export the case-study JSON format.

## What Is Included

- Employee dashboard with search, filtering, sorting, pagination, and row actions.
- Create and edit form with confidential HR fields.
- Delete action with confirmation.
- JSON export endpoint and JSON import endpoint.
- Bundled Purple Cross sample data in [`purple_cross_employees.json`](purple_cross_employees.json).
- Demo login/logout flow for assessment review.
- Unit tests, browser tests, Storybook, Docker assets, and a reusable Helm chart.

## Approach

This is intentionally one deployable Nuxt application. Nuxt handles the user interface and API routes, Prisma/PostgreSQL handles persistence, and shared Zod schemas keep form, API, import, and database validation aligned.

Employment status is derived from employment and termination dates when records are read, rather than stored as a database column. That keeps status deterministic as dates move forward.

The login flow is a lightweight demo gate for review only. It is not presented as production authentication.

## Quick Start

Prerequisites: Node.js 22.12 or newer and Docker.

```bash
npm install
cp .env.example .env
docker compose -f deploy/docker/docker-compose.yml up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev -- --filter @shireburn-platform/employee-management
```

Open `http://localhost:3000/employees`. Protected pages redirect to `/login`; the demo login accepts the prefilled credentials.

## Review Checklist

```bash
npm test
npm run coverage
npm run storybook:build
npm run build
```

For the browser smoke flow, run the seeded app and then run:

```bash
npm run test:e2e
```

## Documentation

- [Architecture](docs/architecture.md) explains the application boundaries, data model, UI approach, authentication, and API routes.
- [Engineering decisions](docs/decisions.md) records why the main implementation choices were made.
- [Testing](docs/testing.md) covers unit, coverage, Storybook, and Playwright verification.
- [Deployment](docs/deployment.md) covers Docker Compose, the production image, and Kubernetes/Helm usage.

## Repository Target

This folder is self-contained and targets the `And1rew132/shireburn-platform` repository.
