# Testing

## Unit Tests

Shared helpers are covered in `packages/shared/src/*.test.ts`:

- status derivation
- filtering
- sorting
- pagination

Database import parsing is covered in `packages/db/src/importEmployees.test.ts`.

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

```bash
npm run coverage
```
