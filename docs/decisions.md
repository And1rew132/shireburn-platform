# Engineering Decisions

## Single Nuxt App

The case study asks for Nuxt backend and frontend. A single Nuxt 4 app with Nitro API routes demonstrates both without introducing an unnecessary service boundary.

## Nuxt UI Dashboard Shell

The main layout uses Nuxt UI dashboard components for the application chrome. `UDashboardGroup`, `UDashboardSidebar`, and `UDashboardNavbar` provide the responsive sidebar/navbar behavior while keeping the employee page focused on the data workflow.

## Prisma Over Drizzle

Prisma was selected for this assessment because its schema, migrations, generated client, and seed workflow are easy for reviewers to run and inspect quickly.

## npm Workspaces

npm workspaces and Turborepo keep the monorepo simple while still separating the Nuxt app, shared schemas/helpers, and Prisma package. Project commands should run on Node.js 22.12 or newer because Nuxt 4.4.x requires it.

## Confidential Fields

The supplied JSON contains basic employee details. The implementation adds optional confidential HR fields so the create/edit workflow aligns with the brief's confidential-information requirement while preserving the original import format.

## Derived Employment Status

Employment status is not stored in the database. It is derived from `dateOfEmployment` and `terminationDate` whenever employee DTOs are returned, which avoids stale records when the current date changes. Server-side filtering converts status selections into date predicates; sorting by status derives status values before pagination.

## No Audit Log Stub

The earlier audit-log stub was removed because it was not exposed as a complete feature. Keeping the model and write side effects without a usable review surface made the code look more complete than it was.
