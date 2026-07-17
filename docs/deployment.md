# Deployment

## Docker Compose

`deploy/docker/docker-compose.yml` runs local PostgreSQL and, under the `app` profile, the Nuxt app image. The app is exposed directly on `localhost:3000` and also includes Traefik labels for a local or shared reverse proxy.

```bash
docker compose -f deploy/docker/docker-compose.yml up -d postgres
docker compose -f deploy/docker/docker-compose.yml --profile app up --build
```

For Traefik, create or reuse the external proxy network first:

```bash
docker network create traefik
TRAEFIK_HOST=shireburn-platform.localhost docker compose -f deploy/docker/docker-compose.yml --profile app up -d --build
```

The default labels route `Host(shireburn-platform.localhost)` through the `web` entrypoint to the Nuxt container on port `3000`. Override `TRAEFIK_HOST`, `TRAEFIK_ENTRYPOINTS`, `TRAEFIK_NETWORK`, `TRAEFIK_TLS`, `TRAEFIK_CERT_RESOLVER`, and `WEB_PORT` from `.env` or the shell.

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
