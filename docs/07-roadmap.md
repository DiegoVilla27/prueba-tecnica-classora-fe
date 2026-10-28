# 07 · Roadmap / plan de trabajo (Frontend)

> **Orden global:** primero el backend completo y desplegado en dev (repo back, `docs/08-roadmap.md`); en paralelo el diseño en Figma; después el front contra la API real.
> Cada hito termina con `typecheck + lint + format:check + test` en verde, una entrada en `AI_LOG.md` y un commit con Conventional Commits (cuando el usuario lo pida).

## Hito 0 · Diseño (Figma) ✅
- [x] Diseño en Figma ([Classora TPV · Login y caja](https://www.figma.com/design/hbVVhN8sPqR56dLazj9IEy/Classora-TPV-%C2%B7-Login-y-caja)): login + caja 70/30, errores, cantidad máxima, deshacer y modales. Capturas en `docs/figma/`.
- [x] Tokens y tipografía definidos en código (Figma no tiene variables), medidos sobre las capturas y ajustados a WCAG AA: `docs/03-ux-ui.md` §4.
- [x] Inventario del design system con Atomic Design (`docs/03-ux-ui.md` §5, `CLAUDE.md` §2.4).
- [x] Revisión de contraste: 2 colores corregidos (`ink-subtle`, `border-strong`). Estados sin frame (venta vacía, error de red, venta finalizada, arranque en frío) se construyen con el mismo sistema.

## Hito 1 · Setup — ~2 h
- [ ] Vite + React 19 + TS, **React Compiler** (`babel-plugin-react-compiler` + regla de lint, comprobado en el build), alias `@core` `@features` `@shared`, puerto 3000, modos `localhost`/`dev`/`prod` + script `local:mock`.
- [ ] Tailwind v4, `clsx`, `tailwind-merge`, `lucide-react`, `sonner`.
- [ ] React Router 7, Zustand, TanStack Query, Axios, React Hook Form, `@hookform/resolvers`, Zod.
- [ ] oxlint, Prettier, Husky + lint-staged + commitlint.
- [ ] Vitest (unit/integration, cobertura 80 %), RTL, user-event, jest-dom, MSW, Playwright (`mocked`/`full-stack`) + axe.
- [ ] `core/` (axios, http, interceptors errors/jwt, errors, router + guards, environments, providers, mocks) y `shared/utils/storage`.
- [ ] Dockerfile (build + nginx), `docker-compose.yml`, `vercel.json`, `.vscode/settings.json`.

## Hito 2 · Auth — ~2 h
- [ ] `auth/services` + DTOs + handlers MSW.
- [ ] `auth/screen` (login con RHF + Zod) + integración L-01…L-03.
- [ ] `use-me`, `use-logout`, guards.

## Hito 3 · Dominio, store y servicios de venta — ~3 h (TDD)
- [ ] `checkout/models` + unit.
- [ ] `checkout/store` (Zustand) + unit.
- [ ] `checkout/services` + DTOs + mapper + handlers MSW (venta en memoria).
- [ ] `use-current-sale`, `use-sale-mutations` (optimistas, `scope`).
- [ ] `catalog` completo (services, mapper, `use-product-lookup`, mocks).

## Hito 4 · Design system (Atomic Design) — ~3 h
- [ ] Tokens y tipografía de `docs/03-ux-ui.md` §4 en el `@theme` (Inter Variable autoalojada).
- [ ] `shared/components/ui`: `atoms` → `molecules` → `organisms` → `templates`, cada nivel con su barrel + barrel raíz; tests de variantes, teclado y `axe`.
- [ ] Regla `no-restricted-imports` que impide importar de un nivel superior.
- [ ] `use-hotkeys`, `use-announcer`, `cn`, `format-money`.

## Hito 5 · Screen de caja — ~5 h
- [ ] checkout-header (cajero + cerrar sesión) · server-status.
- [ ] scan-form — CU-01 · sale-table / sale-line-row — CU-02, CU-03.
- [ ] total-panel + finalize-sale-modal + sale-completed — CU-04.
- [ ] clear-sale-modal — CU-05 · shortcuts-bar + atajos — CU-06.
- [ ] Integración I-01…I-12.

## Hito 6 · E2E, accesibilidad y calidad — ~2 h
- [ ] Specs Playwright (`mocked` y `full-stack`) + axe.
- [ ] Revisión manual: solo teclado + VoiceOver.
- [ ] Fidelidad Figma vs app (capturas).

## Hito 7 · CI/CD y despliegue — ~2 h
- [ ] Workflow `ci.yml` (quality, unit, integration, e2e mocked, e2e full-stack, build).
- [ ] Proyecto Vercel (prod = `main`, preview = `dev`) + variables + dominio estable de dev.
- [ ] Dominios añadidos al CORS del back.
- [ ] Rama `dev` + protección de ramas.

## Hito 8 · Entrega
- [ ] README: URLs dev/prod, credenciales demo, cómo ejecutar (local, docker), arquitectura, decisiones, GIF.
- [ ] Enlace a Figma.
- [ ] `AI_LOG.md` revisado (resumen + entradas).

## Futuro (YAGNI hoy, para la entrevista)
Pagos (efectivo con cambio, tarjeta) · ticket · IVA por producto · promociones · búsqueda manual por nombre · modo offline (IndexedDB + cola de sincronización) · refresh token en cookie `HttpOnly` · multi-caja · devoluciones · i18n · tema alto contraste · sonido de escaneo.
