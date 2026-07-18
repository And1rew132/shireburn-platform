# Testing

## Unit Tests

Shared helpers are covered in `packages/shared/src/*.test.ts`:

- employment status derivation from date fields

Database import parsing is covered in `packages/db/src/importEmployees.test.ts`.

Nuxt component tests live beside the components in `apps/web/app/components/__tests__/` and cover the status badge, metric card, and employee form validation path.

Run:

```bash
npm test
```

## E2E Tests

Playwright tests live in `e2e/` and cover the dashboard smoke path: loading the employee table, checking responsive dashboard chrome, searching, and opening the create form.

Run with a seeded database and the default dev server:

```bash
npm run test:e2e
```

When the app is already running in Docker on a custom port, pass the base URL and skip Playwright's built-in dev-server startup:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npm run test:e2e
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
