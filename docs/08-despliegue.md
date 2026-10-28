# 08 · Entornos, Docker y despliegue (Frontend)

## 1. Entornos

| Entorno | Cómo se ejecuta | API |
|---|---|---|
| **local** | `pnpm local` (Vite, :3000) | back local `:8080` |
| **local sin back** | `pnpm local:mock` | MSW en el navegador |
| **docker** | `docker compose up --build -d` | back en contenedor (red `shared-network`) |
| **dev** | Vercel, rama `dev` | Render `pos-api-dev` |
| **prod** | Vercel, rama `main` | Render `pos-api-prod` |

Archivos: `.env.localhost`, `.env.mock`, `.env.dev`, `.env.prod` y `.env.test` (Vitest) con solo variables públicas `VITE_*` (`VITE_ENV_NAME`, `VITE_API_URL`, `VITE_USE_MOCKS`): nunca secretos, todo lo `VITE_*` acaba en el bundle.

## 2. Docker

`Dockerfile` multi-stage:
1. `node:22-alpine` + pnpm → `pnpm install --frozen-lockfile` → `pnpm build:<modo>` (`ARG BUILD_MODE=localhost`).
2. `nginx:alpine` sirve `dist/` con *fallback* SPA (`try_files $uri /index.html`) en el puerto 3000.

> Diferencia con task-manager-client, que ejecuta `vite dev` en el contenedor: aquí se sirve el *build* de producción (más realista y ligero).

`docker-compose.yml`:
```yaml
name: classora-pos-web
networks:
  shared-network:
    external: true
services:
  pos-web:
    build:
      context: .
      args:
        BUILD_MODE: localhost
    container_name: pos_web
    restart: always
    ports:
      - "3000:3000"
    networks:
      - shared-network
```
Sistema completo en local: `global_postgres` (infra compartida) + `pos_api` (repo back) + `pos_web` (este repo).

## 3. Vercel
- Un proyecto conectado al repo de GitHub.
- **Production branch**: `main` → `VITE_API_URL` = API Render prod.
- **Preview** (rama `dev`) → `VITE_API_URL` = API Render dev. Se fija un dominio estable para `dev` (p. ej. `classora-pos-dev.vercel.app`) para poder añadirlo al CORS del back.
- Build: `pnpm build:prod` / `pnpm build:dev` según entorno (variable `VERCEL_ENV`), output `dist`.
- `vercel.json`: *rewrite* SPA (`/(.*)` → `/index.html`) y cabeceras de seguridad (`Content-Security-Policy` con `connect-src` limitado a la API, `X-Content-Type-Options`, `Referrer-Policy`).

## 4. CI (GitHub Actions · `.github/workflows/ci.yml`, como task-manager-client)

| Job | Pasos |
|---|---|
| `quality` | `pnpm install --frozen-lockfile` · `format:check` · `lint` · `typecheck` |
| `unit` | `pnpm test:unit` (cobertura ≥ 80 %) |
| `integration` | `pnpm test:integration` (MSW) |
| `e2e-mocked` | Playwright proyecto `mocked` (MSW) + axe |
| `e2e-full-stack` | Levanta PostgreSQL + la imagen de la API (checkout del repo back) en Docker → Playwright proyecto `full-stack` contra `http://localhost:3000` · sube trazas y logs si falla |
| `build` | `pnpm build:prod` |

El **deploy** lo hace la integración Git de Vercel (`dev` → preview, `main` → production) solo si el CI está en verde (*required checks* en las ramas protegidas).

Ramas: `feature/*` → PR a `dev` → PR a `main`.

## 5. Checklist de puesta en marcha
- [ ] Back desplegado en dev y prod (repo back, `docs/07-despliegue.md`).
- [ ] Proyecto Vercel + variables por entorno + dominio estable de dev.
- [ ] Dominios de Vercel añadidos a `CORS_ALLOWED_ORIGINS` en Render.
- [ ] Rama `dev` creada y protegida.
- [ ] URLs y credenciales demo en el README.
