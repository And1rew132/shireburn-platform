# Testing

## Unit Tests

Shared helpers are covered in `packages/shared/src/*.test.ts`:

- status derivation
- filtering
- sorting
- pagination

Database import parsing is covered in `packages/db/src/importEmployees.test.ts`.

Nuxt component tests live beside the components in `apps/web/app/components/__tests__/` and cover the status badge, metric card, and employee form validation path.

Run:

```bash
npm test
```

## E2E Tests

Playwright tests live in `e2e/` and cover the dashboard smoke path: loading the employee table, searching, and opening the create form.

Run with a seeded database:

```bash
npm run test:e2e
```

## Coverage

Coverage is required for the submission and is generated per workspace under each package/app `coverage/` folder.

```bash
npm run coverage
```

## Storybook

Storybook stories live beside the Nuxt components in `apps/web/app/components/*.stories.ts`. Build Storybook before handoff so the component catalog is verified.

```bash
npm run storybook
npm run storybook:build
```
