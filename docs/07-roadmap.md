# 07 · Roadmap / plan de trabajo (Frontend)

> **Orden global:** primero el backend completo y desplegado en dev (repo back, `docs/08-roadmap.md`); en paralelo el diseño en Figma; después el front contra la API real.
> Cada hito termina con `typecheck + lint + format:check + test` en verde, una entrada en `AI_LOG.md` y un commit con Conventional Commits (cuando el usuario lo pida).

## Hito 0 · Diseño (Figma) ✅
- [x] Diseño en Figma ([Classora TPV · Login y caja](https://www.figma.com/design/hbVVhN8sPqR56dLazj9IEy/Classora-TPV-%C2%B7-Login-y-caja)): login + caja 70/30, errores, cantidad máxima, deshacer y modales. Capturas en `docs/figma/`.
- [x] Tokens y tipografía definidos en código (Figma no tiene variables), medidos sobre las capturas y ajustados a WCAG AA: `docs/03-ux-ui.md` §4.
- [x] Inventario del design system con Atomic Design (`docs/03-ux-ui.md` §5, `CLAUDE.md` §2.4).
- [x] Revisión de contraste: 2 colores corregidos (`ink-subtle`, `border-strong`). Estados sin frame (venta vacía, error de red, venta finalizada, arranque en frío) se construyen con el mismo sistema.

## Hito 1 · Setup ✅
- [x] Vite 8 + React 19 + TS 6, **React Compiler** (`babel-plugin-react-compiler` 1.0 vía `@rolldown/plugin-babel`; reglas `react-compiler/*` en oxlint; comprobado en el build con `react.memo_cache_sentinel`), alias `@core` `@features` `@shared`, puerto 3000, modos `localhost`/`mock`/`dev`/`prod`.
- [x] Tailwind v4 con los tokens de `docs/03-ux-ui.md` §4, Inter Variable autoalojada, `clsx`, `tailwind-merge`, `lucide-react`, `sonner`.
- [x] React Router 7, Zustand, TanStack Query, Axios, React Hook Form, `@hookform/resolvers`, Zod.
- [x] oxlint (reglas de dependencia y de Atomic Design como errores), Prettier, Husky + lint-staged + commitlint.
- [x] Vitest (unit/integration, cobertura 80 %), RTL, user-event, jest-dom, MSW, axe-core; Playwright (`mocked`/`full-stack`) + `@axe-core/playwright` con un smoke test.
- [x] `core/` (axios, http, interceptors errors/jwt con refresh único, `ApiError`, router + guards, environments, providers, mocks) y `shared/utils/{cn,storage}`. Pantallas de login y caja como marcadores (se construyen en los hitos 2 y 5).
- [x] Dockerfile (build + nginx), `docker-compose.yml`, `vercel.json` (SPA + CSP), `.vscode/`.

## Hito 2 · Auth ✅
- [x] `auth/services` (`loginSvc` con timeout de 60 s para el arranque en frío, `getMeSvc`, `logoutSvc`) + DTOs Zod + mapper + handlers MSW con las mismas respuestas que la API.
- [x] `auth/screen` (`AuthLayout` + `BrandPanel` + `LoginForm` con RHF + Zod), fiel al frame de Figma + integración L-01…L-03, red caída, 429, `?expired=1` y logout.
- [x] `use-me`, `use-logout` (en `auth`, públicos por `@features/auth`); guards del hito 1. La caja provisional ya muestra el cajero y "Salir".
- [x] Adelantado del hito 4 lo que necesita el login: átomos `Button`, `Input`, `Label`, `Logo`, `Overline`, `Spinner`; moléculas `FormField`, `PasswordField`, `Alert`; plantilla `AuthLayout` (con tests y `axe`).
- [x] E2E `login` en `mocked` y `full-stack` (contra la API real).

## Hito 3 · Dominio, store y servicios de venta ✅ (TDD)
- [x] `checkout/models` (money, quantity, sale-line, sale) con los tests escritos primero; mismas reglas que el agregado del back.
- [x] `checkout/store` (Zustand): `sale` + `serverSale` + estado de UI, `confirmSale` según la cola, `rollback` a la venta confirmada, selectores.
- [x] `checkout/services` (7 endpoints, 409 al abrir → venta existente) + DTOs Zod + mapper + venta en memoria en MSW con las reglas del back.
- [x] `use-current-sale` (reintentos de arranque en frío) y `use-sale-mutations` (optimistas, `scope`, líneas por producto, solo la última respuesta pinta).
- [x] `catalog` completo (service con `ProductNotFoundError`, mapper, `use-product-lookup` con caché de 5 min, mocks con los 20 EAN-13 de la V3).

## Hito 4 · Design system (Atomic Design) ✅
- [x] Tokens y tipografía de `docs/03-ux-ui.md` §4 en el `@theme` (Inter Variable autoalojada).
- [x] `shared/components/ui` completo (26 piezas): átomos `IconButton`, `Badge`, `Avatar`, `Kbd`, `Money`, `Card`; moléculas `QuantityStepper`, `KeyValue`, `ShortcutHint`, `UserBadge`, `EmptyState`; organismos `Modal` (`<dialog>` nativo), `AppHeader`, `ShortcutsBar`, `DataTable`; plantilla `AppLayout`. Tests de variantes, teclado y `axe`. `Toaster` con el estilo del frame.
- [x] Regla `no-restricted-imports` que impide importar de un nivel superior (hito 1).
- [x] `use-hotkeys` (`useEffectEvent`, respeta los campos de texto), `use-announcer` (una región `aria-live` para toda la app), `cn`, `format-money`.

## Hito 5 · Screen de caja ✅
- [x] checkout-header (cajero + "Salir" con confirmación si hay productos, CU-07) · server-status (arranque en frío / error + Reintentar).
- [x] scan-form — CU-01 (multiplicador `N*código`, cola de escaneos en orden, errores inline) · sale-table / sale-line-row — CU-02, CU-03 (− en 1 elimina con Deshacer).
- [x] total-panel + finalize-sale-modal + sale-completed — CU-04.
- [x] clear-sale-modal — CU-05 · barra de atajos + `F12`, `↑↓`, `+`/`-`, `Supr`, `Ctrl+Z`, `Esc` — CU-06.
- [x] Integración I-01…I-12 + alternativos (17 tests) y e2e de la caja en `mocked` (4) y `full-stack` (2).

## Hito 6 · E2E, accesibilidad y calidad ✅
- [x] Specs Playwright (`mocked` y `full-stack`) + axe (adelantado en los hitos 2 y 5).
- [x] Auditoría en navegador: orden de Tab, foco visible, árbol accesible, zoom 200 % y tablet sin scroll horizontal. Mejoras: steppers sin `aria-live` (cantidad anunciada una vez) y `aria-keyshortcuts="F12"`.
- [x] Checklist WCAG con evidencia y guion de VoiceOver (`docs/03-ux-ui.md` §7). Pasada real con VoiceOver hecha por el autor: correcta.
- [x] Fidelidad Figma vs app: 9 comparativas en `docs/figma/vs-app/` contra la API real.

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
