# Deployment

## Docker Compose

`deploy/docker/docker-compose.yml` runs local PostgreSQL and, under the `app` profile, the Nuxt app image.

```bash
docker compose -f deploy/docker/docker-compose.yml up -d postgres
docker compose -f deploy/docker/docker-compose.yml --profile app up --build
```

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
