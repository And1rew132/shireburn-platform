FROM node:22.12-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* turbo.json tsconfig.json ./
COPY apps/employee-management/package.json apps/employee-management/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/db/package.json packages/db/package.json
RUN npm install

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run db:generate
RUN npm run build -- --filter @shireburn-platform/employee-management

FROM deps AS storybook
WORKDIR /app
COPY . .
EXPOSE 6006
CMD ["node", "node_modules/storybook/dist/bin/dispatcher.js", "dev", "--config-dir", "apps/employee-management/.storybook", "--host", "0.0.0.0", "--port", "6006"]

FROM node:22.12-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/employee-management/.output ./.output
COPY --from=build /app/packages/db/prisma ./packages/db/prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./.output/server/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./.output/server/node_modules/@prisma
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
