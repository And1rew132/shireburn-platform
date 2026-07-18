# Deployment

## Docker Compose

`deploy/docker/docker-compose.yml` runs local PostgreSQL and bind-mounted dev containers for the Nuxt app and Storybook. The app profile exposes Nuxt on `WEB_PORT` with container port `3000`; Storybook exposes `STORYBOOK_PORT` with container port `6006`.

```bash
docker compose -f deploy/docker/docker-compose.yml up -d postgres
docker compose -f deploy/docker/docker-compose.yml --profile app up -d --build employee-management-web
docker compose -f deploy/docker/docker-compose.yml --profile storybook up -d --build storybook
```

Defaults:

- PostgreSQL: `localhost:5434`
- Nuxt app: `http://localhost:3000/employees`
- Storybook: `http://localhost:6006`

The dev containers bind mount the repository at `/workspace`, so source changes are picked up without rebuilding. Rebuild when dependencies, lockfiles, or `deploy/docker/dev/Dockerfile` change.

## Traefik

For Traefik, create or reuse the external proxy network first:

```bash
docker network create traefik
```

Then override host settings from the shell or an uncommitted `.env` file:

```bash
TRAEFIK_HOST=shireburn.localhost \
STORYBOOK_TRAEFIK_HOST=shireburn-storybook.localhost \
TRAEFIK_ENTRYPOINTS=websecure \
TRAEFIK_TLS=true \
WEB_PORT=3012 \
STORYBOOK_PORT=6016 \
docker compose -f deploy/docker/docker-compose.yml --profile app --profile storybook up -d --build
```

Do not commit personal/internal hostnames or secrets. The compose labels route the configured app host to container port `3000` and the configured Storybook host to container port `6006`.

## Production Image

`deploy/docker/Dockerfile` builds one Nuxt/Nitro runtime image for `@shireburn-platform/employee-management`. It installs workspace dependencies, generates Prisma client code, builds the Nuxt app, and runs `.output/server/index.mjs`.

`.github/workflows/container.yml` runs on `main`, installs dependencies, generates Prisma client code, runs unit tests, builds the app, and publishes `ghcr.io/and1rew132/shireburn-platform` with `main` and commit-SHA tags. It does not edit chart values; live image pins belong to the chart consumer in CRC GitOps.

## Kubernetes

`deploy/chart` contains a reusable Helm chart with:

- Deployment and Service for the Nuxt app.
- Migration Job for Prisma migrations.
- Secret rendering for simple review deployments.
- External secret support for `SESSION_SECRET` through `secrets.existingSecret`.
- External database support through `database.existingSecret` and `database.urlKey`.
- Optional demo PostgreSQL deployment for non-production review environments.
- Optional Traefik `IngressRoute` for direct cluster ingress.

This repository defines how the app can be deployed. It does not own live environment placement, public hostnames, runtime secrets, or deployed image pins. Those values should be set by the chart consumer in the relevant infrastructure repository.

A production-style chart consumer should provide an existing runtime secret and an existing database secret, for example:

```bash
helm template shireburn-employee-management deploy/chart \
  --namespace shireburn-employee-management \
  --set namespace.name=shireburn-employee-management \
  --set host=<environment-hostname> \
  --set secrets.existingSecret=shireburn-employee-management-secrets \
  --set database.existingSecret=shireburn-employee-management-db \
  --set database.urlKey=DATABASE_URL \
  --set postgres.enabled=false \
  --set imagePullSecrets[0].name=<image-pull-secret> \
  --set image.tag=<deployed-image-tag> \
  | kubectl apply -f -
```

For a temporary self-contained review deployment, enable the bundled Postgres chart values instead:

```bash
helm upgrade --install shireburn-employee-management deploy/chart \
  --namespace shireburn-employee-management \
  --create-namespace \
  --set secrets.sessionSecret="$SESSION_SECRET" \
  --set postgres.enabled=true \
  --set postgres.password="$POSTGRES_PASSWORD"
```

Do not commit personal hostnames, `DATABASE_URL`, database passwords, session secrets, or live image pins to this repository.
