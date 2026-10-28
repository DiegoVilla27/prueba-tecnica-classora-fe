# ==============================================================================
# STAGE 1: BUILD (pnpm install + vite build for the given mode)
# ==============================================================================
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Dependencies first, to cache them between builds
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
ARG BUILD_MODE=localhost
RUN pnpm build:${BUILD_MODE}

# ==============================================================================
# STAGE 2: RUNTIME (nginx serving the static build with SPA fallback)
# ==============================================================================
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000
