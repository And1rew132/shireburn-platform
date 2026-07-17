# Engineering Decisions

## Single Nuxt App

The case study asks for Nuxt backend and frontend. A single Nuxt 4 app with Nitro API routes demonstrates both without introducing an unnecessary service boundary.

## Prisma Over Drizzle

Prisma was selected for this assessment because its schema, migrations, generated client, and seed workflow are easy for reviewers to run and inspect quickly.

## npm Workspaces

The local machine already has Node 20 and npm available, and existing nearby assessments use npm/Turbo. That keeps setup predictable for the current environment.

## Confidential Fields

The supplied JSON contains basic employee details. The implementation adds optional confidential HR fields so the create/edit workflow aligns with the brief's confidential-information requirement while preserving the original import format.
