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

`deploy/docker/Dockerfile` builds one Nuxt/Nitro runtime image. It installs workspace dependencies, generates Prisma client code, builds the Nuxt app, and runs `.output/server/index.mjs`.

## Kubernetes

`deploy/chart` contains a small Helm chart with:

- Deployment and Service for the Nuxt app.
- Migration Job for Prisma migrations.
- Secret for `DATABASE_URL` and `SESSION_SECRET`.
- Optional demo PostgreSQL deployment.
- Traefik `IngressRoute` for the public host.

Real deployments should source secrets from cluster secret management, not from committed values.
