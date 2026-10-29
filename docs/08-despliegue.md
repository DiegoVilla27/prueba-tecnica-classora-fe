# 08 · Entornos, Docker y despliegue (Frontend)

## 1. Entornos

| Entorno | Cómo se ejecuta | API |
|---|---|---|
| **local** | `pnpm local` (Vite, :3000) | back local `:8080` |
| **local sin back** | `pnpm local:mock` | MSW en el navegador |
| **docker** | `docker compose up --build -d` | back en contenedor (red `shared-network`) |
| **dev** | Vercel, rama `dev` → https://classora-tpv-dev.vercel.app | Render `pos-api-dev` (`https://pos-api-dev-k0y9.onrender.com/api/v1`) |
| **prod** | Vercel, rama `main` → https://classora-tpv-prod.vercel.app | Render `pos-api-prod` (`https://pos-api-prod.onrender.com/api/v1`) |

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
- Un proyecto conectado al repo de GitHub, con la variable `ENABLE_EXPERIMENTAL_COREPACK=1` para que Vercel use el pnpm de `packageManager` (11).
- **Production branch**: `main` → https://classora-tpv-prod.vercel.app, construido con `build:prod` (`VITE_API_URL` de `.env.prod`: API Render prod).
- **Preview** (rama `dev`) → dominio estable https://classora-tpv-dev.vercel.app (Settings → Domains → Git Branch `dev`), construido con `build:dev` (API Render dev). Las previews de ramas `feature/*` también usan `build:dev`, pero su URL aleatoria no está en el CORS del back.
- Las variables `VITE_*` van en los `.env.<modo>` del repo (son públicas), no en Vercel.
- Build: `vercel.json` elige `pnpm build:prod` o `pnpm build:dev` según `VERCEL_ENV`; output `dist`.
- Una rama solo tiene despliegue tras un push posterior a conectar el proyecto (por eso `dev` aparece "No Deployment" hasta su primer merge).
- **Deployment Protection**: Vercel protege por defecto con login (Vercel Authentication) todo lo que no es producción, incluido `dev` (redirige a `vercel.com/sso-api`). Se desactiva en Settings → Deployment Protection para que dev sea público.
- `vercel.json`: *rewrite* SPA (`/(.*)` → `/index.html`) y cabeceras de seguridad (`Content-Security-Policy` con `connect-src` limitado a la API, `X-Content-Type-Options`, `Referrer-Policy`).

## 4. CI (GitHub Actions · `.github/workflows/ci.yml`, como task-manager-client)

| Job | Pasos |
|---|---|
| `quality` | `pnpm install --frozen-lockfile` · `format:check` · `lint` · `typecheck` |
| `unit` | `pnpm test:unit` (cobertura ≥ 80 %) |
| `integration` | `pnpm test:integration` (MSW) |
| `e2e-mocked` | Playwright proyecto `mocked` (MSW) + axe |
| `e2e-full-stack` | PostgreSQL 16 como *service* (credenciales del perfil `local` del back) + imagen del back construida desde `DiegoVilla27/prueba-tecnica-classora-be@main` y arrancada con `--network host` → Playwright `full-stack` (`pnpm local`) · si falla, logs del back e informe de Playwright |
| `build` | `pnpm build:prod` |

El **deploy** lo hace la integración Git de Vercel (`dev` → preview, `main` → production). Solo llega código con el CI en verde porque `main` y `dev` están protegidas: PR obligatorio y check `🛡️ Frontend CI Quality Gate` (también para admins).

Ramas: `feature/*` → PR a `dev` → PR a `main`.

## 5. Checklist de puesta en marcha
- [x] Back desplegado en dev y prod (repo back, `docs/07-despliegue.md`).
- [x] Proyecto Vercel + `ENABLE_EXPERIMENTAL_COREPACK=1` + dominio estable de dev.
- [x] Dominios de Vercel añadidos a `CORS_ALLOWED_ORIGINS` en Render (verificado con preflight: permitidos y 403 para otros orígenes): dev `http://localhost:[*],https://classora-tpv-dev.vercel.app` · prod `https://classora-tpv-prod.vercel.app`.
- [x] Rama `dev` creada y protegida (y `main`).
- [ ] URLs y credenciales demo en el README (hito 8).
