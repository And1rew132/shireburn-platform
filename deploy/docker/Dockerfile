FROM node:20.19-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* turbo.json tsconfig.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/db/package.json packages/db/package.json
RUN npm install

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run db:generate
RUN npm run build -- --filter @purple-cross/web

FROM node:20.19-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.output ./.output
COPY --from=build /app/packages/db/prisma ./packages/db/prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
