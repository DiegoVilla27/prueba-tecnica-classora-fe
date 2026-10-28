# 07 · Roadmap / plan de trabajo (Frontend)

Cada hito termina con `typecheck + lint + format:check + test` en verde, una entrada en `AI_LOG.md` y (si el usuario lo pide) un commit con Conventional Commits.

## Hito 0 · Diseño (Figma) — ~4 h
- [ ] Wireframe en baja (layout 70/30, ver `03-ux-ui.md`).
- [ ] Variables de Figma = tokens del `@theme`.
- [ ] Biblioteca de componentes con variantes (Auto Layout).
- [ ] Frames 1–9 + prototipo del flujo principal.
- [ ] Revisión de contraste, tamaños y foco.

## Hito 1 · Setup — ~1 h
- [ ] `pnpm create vite` (React + TS), React Compiler (`babel-plugin-react-compiler`), alias `@core` `@features` `@shared`, puerto 3000, modos `localhost/dev/prod` + `.env.*`.
- [ ] Tailwind v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge`, `lucide-react`, `sonner`.
- [ ] Zustand, TanStack Query, Axios, React Hook Form, `@hookform/resolvers`, Zod.
- [ ] oxlint (`react`, `typescript`, `oxc`, `jsx-a11y`, `import` + `no-restricted-imports`), Prettier (config de task-manager), Husky + lint-staged + commitlint.
- [ ] Vitest (proyectos unit/integration, cobertura 80 %), RTL, user-event, jest-dom, MSW (`msw init public/`), Playwright + `@axe-core/playwright`.
- [ ] `.vscode/settings.json` con `customLabels` para `index.*`.
- [ ] `core/` (axios, http, interceptors/errors, errors/api-error, environments, providers, mocks).

## Hito 2 · Dominio y store — ~2 h (TDD)
- [ ] `models/*` (money, quantity, sale-line, sale) + unit.
- [ ] `checkout/store` (Zustand) + selectores + unit.

## Hito 3 · Catálogo — ~1,5 h
- [ ] `catalog/mocks` (20 productos con EAN-13) + handlers (200/404/400).
- [ ] DTO + schema Zod + mapper + `getProductByCodeSvc` + unit.
- [ ] `use-product-lookup` (TanStack Query) + API pública `catalog/index.ts`.

## Hito 4 · Design system — ~2 h
- [ ] Tokens `@theme` fieles a Figma.
- [ ] `shared/components/ui`: button, icon-button, input, quantity-stepper, money, alert, modal, kbd, empty-state + barrel + unit.
- [ ] `use-hotkeys`, `use-announcer`, `cn`, `format-money`.

## Hito 5 · Screen de caja — ~4 h
- [ ] scan-form (RHF + Zod + lookup + store) — CU-01.
- [ ] sale-table / sale-line-row (stepper, eliminar, deshacer) — CU-02, CU-03.
- [ ] total-panel + finalize-sale-modal + sale-completed — CU-04.
- [ ] clear-sale-modal — CU-05 · shortcuts-bar + atajos — CU-06.
- [ ] Integración I-01…I-09.

## Hito 6 · E2E y calidad — ~1,5 h
- [ ] 4 specs Playwright + axe.
- [ ] Revisión de accesibilidad manual (solo teclado + VoiceOver).
- [ ] Revisión de fidelidad Figma vs app.

## Hito 7 · Entrega — ~1,5 h
- [ ] README: cómo ejecutar, scripts, arquitectura, decisiones.
- [ ] `AI_LOG.md` revisado (resumen + entradas).
- [ ] Dockerfile (Node 22 Alpine, como task-manager) y/o deploy estático con MSW activo + GIF en README.
- [ ] Enlace a Figma en README.

## Hito 8 (opcional) · Conexión con backend Java
- [ ] `.env.dev` con `VITE_USE_MOCKS=false` → `GET /products/{code}` real.
- [ ] Venta en servidor con UI optimista (`checkout/services` + mutations).

## Futuro (YAGNI hoy, se menciona en la entrevista)
Login de cajero (JWT como task-manager) · pagos (efectivo con cambio, tarjeta) · ticket · IVA por producto · promociones · búsqueda manual por nombre · recuperar venta tras recargar (`persist` de Zustand) · modo offline (IndexedDB + cola) · multi-caja · devoluciones · i18n · tema alto contraste · sonido de escaneo.
