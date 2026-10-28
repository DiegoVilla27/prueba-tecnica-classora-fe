# CLAUDE.md — Reglas del agente (Frontend · TPV Classora)

> Este archivo es **ley** para cualquier agente (Claude Code u otro) y para cualquier persona que toque el código.
> Si una regla choca con una petición puntual, se pregunta antes de romperla.
> Las reglas salen de la forma de trabajo del autor en
> [`task-manager-client`](https://github.com/DiegoVilla27/task-manager-system/tree/main/apps/task-manager-client), adaptadas a esta prueba.
> Negocio y diseño: [`docs/`](docs/). Skills: [`.claude/skills/`](.claude/skills/). Log de IA: [`AI_LOG.md`](AI_LOG.md).

---

## 0. Contexto en una frase

Pantalla de **caja de supermercado** (React + TypeScript) usada de forma intensiva por cajeros: **rapidez, legibilidad, accesibilidad y prevención de errores** mandan sobre cualquier decisión estética o técnica.

---

## 1. Stack fijado (no cambiar sin ADR en `docs/04-arquitectura.md`)

| Ámbito | Elección |
|---|---|
| Build | Vite · alias `@core`, `@features`, `@shared` · puerto 3000 · modos `localhost` / `dev` / `prod` (`.env.<modo>`) |
| UI | React 19 + TypeScript `strict` + **React Compiler** |
| Estado de cliente (venta en curso) | **Zustand** |
| Estado de servidor / caché | **TanStack Query** |
| HTTP | **Axios**: `core/axios` (instancia) + `core/http` (`httpService`) + `core/interceptors` |
| Formularios | **React Hook Form + Zod** (`@hookform/resolvers/zod`) |
| Validación runtime de respuestas | Zod en `services/dtos` |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`), tokens en `@theme` de `src/index.css`, `cn()` = `clsx` + `tailwind-merge` |
| Iconos / toasts | `lucide-react` · `sonner` |
| Unit / integración | Vitest (proyectos `unit` e `integration`) + React Testing Library + `user-event` + `jest-dom` |
| Mock de red | MSW (Node en tests, Worker en dev/e2e) |
| E2E | Playwright + `@axe-core/playwright` |
| Calidad | oxlint (plugins `react`, `typescript`, `oxc`, `jsx-a11y`, `import`) · Prettier · Husky + lint-staged · commitlint (Conventional Commits) |

> **No aplica** (es una SPA con Vite): Server Components, Server Actions, React Router, Redux. Si una skill copiada de task-manager los menciona, se ignora esa parte.

---

## 2. Arquitectura: modular por *features*

```
src/
├── main.tsx                   # Entrypoint: monta App, registra interceptores, arranca MSW si VITE_USE_MOCKS
├── index.css                  # @import 'tailwindcss' + @theme (tokens de Figma)
├── setupTests.ts              # jest-dom, ciclo de vida del server MSW
├── core/                      # Transversal SIN UI de negocio
│   ├── axios/                 # instancia Axios (baseURL, timeout, headers)
│   ├── http/                  # httpService (get/post/patch/delete tipados)
│   ├── interceptors/errors/   # normaliza errores a ApiError
│   ├── environments/          # lectura tipada de import.meta.env
│   ├── providers/             # QueryClientProvider + Toaster
│   └── mocks/                 # browser worker + agregador de handlers
├── shared/                    # Reutilizable entre features, sin negocio
│   ├── components/ui/         # Design system (button, input, modal, alert, kbd…) + index.ts barrel
│   ├── hooks/                 # use-hotkeys, use-announcer…
│   ├── utils/                 # cn, format-money…
│   └── mocks/server/          # setupServer para tests
└── features/
    └── [feature]/
        ├── index.ts           # API pública de la feature (lo único importable desde fuera)
        ├── components/        # Componentes globales de la feature
        ├── hooks/             # Hooks globales de la feature
        ├── services/          # Acceso a datos de la feature
        │   ├── index.ts       #   funciones xxxSvc (una por endpoint)
        │   ├── dtos/
        │   │   ├── request/   #   tipos de request
        │   │   └── response/  #   tipos + schemas Zod de response
        │   └── mappers/       #   DTO ⇄ modelo de dominio
        ├── models/            # Tipos y funciones de dominio puras (sin React, sin Axios)
        ├── store/             # Store Zustand de la feature
        ├── constants/         # límites, mensajes (microcopy)
        ├── mocks/             # data/ (fixtures) + handlers/ (MSW)
        └── screen/            # Pantalla de la feature
            ├── index.tsx      #   <XxxScreen /> (contenedor)
            ├── hooks/         #   hook de la screen (lógica de orquestación)
            └── components/    #   componentes SOLO de esta screen, cada uno con su hooks/ y schema/ si los necesita
e2e/                           # Specs Playwright
```

### 2.1 Regla de oro: **un módulo = una carpeta = `index`**

- Cada módulo vive en su carpeta y su archivo se llama **`index.tsx`** (si tiene JSX) o **`index.ts`** (si no).
- Carpetas en **kebab-case** minúscula: `scan-form/`, `sale-table/`, `use-hotkeys/`, `format-money/`.
- Lo que un componente necesita va **dentro de su carpeta**:
  ```
  scan-form/
  ├── index.tsx                  # componente
  ├── index.test.tsx             # unit
  ├── hooks/index.ts             # su hook (useScanForm)
  ├── hooks/index.test.ts
  └── schema/index.ts            # schema Zod del formulario
  ```
- Import siempre por carpeta: `import ScanForm from './components/scan-form'` ✅ · `'./components/scan-form/index'` ❌.

### 2.2 Exports: **default vs named** (importante, no improvisar)

| Tipo de módulo | Export | Ejemplo | Por qué |
|---|---|---|---|
| **Screen** | named **y** default | `export const CheckoutScreen…; export default CheckoutScreen;` | default permite `React.lazy`; named para tests y la API pública |
| **Componente de feature / screen** | named **y** default | `export const SaleTable…; export default SaleTable;` | El padre lo importa por default (`import SaleTable from './components/sale-table'`) como en task-manager |
| **Componente de `shared/components/ui`** | **solo named** + barrel `ui/index.ts` (`export * from './button'`) | `import { Button, Modal } from '@shared/components/ui'` | Un único punto de entrada al design system |
| **Hook** (de componente, screen, feature o shared) | **default** | `const useScanForm = () => {…}; export default useScanForm;` | Un hook por carpeta; el nombre lo pone quien importa |
| **Schema Zod de formulario** | **default** | `export default ScanSchema;` | Uno por carpeta `schema/` |
| **Store Zustand** | **default** (hook) + named (selectores, `initialSaleState`) | `export default useSaleStore; export const selectTotal…` | El hook es el módulo; selectores y estado inicial para tests |
| **Services** | **named**, sufijo `Svc` | `export { getProductByCodeSvc }` | Varias funciones por feature |
| **DTOs / mappers / models / utils / constants** | **named** | `export type ProductResponseDto…`, `export const toProduct…`, `export function cn…` | Colecciones; tree-shaking; nombres estables |
| **core**: axios | named **y** default | `axiosInstance` | Igual que task-manager |
| **core**: http | named | `httpService` | |
| **core**: interceptors | default | `interceptorErrors` | Se registran una vez en `main.tsx` |
| **core**: environments | named | `environment` | |
| **MSW handlers / server** | default | `export default handlersProducts` | Se agregan en un array |
| **API pública de feature** (`features/x/index.ts`) | named re-exports | `export { CheckoutScreen } from './screen'` | Frontera controlada |
| Configs de herramientas | default | `vite.config.ts`, `playwright.config.ts` | Lo exige la librería |

### 2.3 Reglas de dependencia (se validan con `no-restricted-imports` de oxlint)

```
main.tsx → core/providers → features → shared → core
```
- `core` no importa de `features`.
- `shared` no importa de `features`.
- Una feature **no importa el interior de otra**: solo su `index.ts` público.
- `screen/components/*` y `screen/hooks` son privados de la screen.
- `models/` es TypeScript puro: no importa React, Axios, Zustand ni services.
- Los componentes **nunca** llaman a services ni a Axios: lo hacen sus **hooks** (TanStack Query / store).

### 2.4 Flujo de datos

```
Componente (pinta) → su hook (orquesta) → TanStack Query → xxxSvc → httpService → axios
                                       ↘ useSaleStore (acciones) → funciones puras de models/
                                                                   mapper DTO → modelo ↗
```
- Los componentes reciben **modelos de dominio**, nunca DTOs. El mapper es la única frontera.
- **Server state** (productos) → TanStack Query. **Client state** (venta en curso) → Zustand. **Estado local** (abrir/cerrar algo) → `useState`. Nunca `useEffect` para pedir datos.

---

## 3. Estado con Zustand (venta)

- Un store por feature en `store/index.ts`: `create<SaleStore>()(devtools((set, get) => ({…})))` (`devtools` solo en desarrollo).
- **La lógica de negocio vive en `models/`** (funciones puras `addProductToSale(sale, product, qty) → Sale`); las acciones del store solo las llaman y hacen `set`. Así el dominio se testea sin store y el store se testea sin UI.
- **Selecciones atómicas**: `useSaleStore((s) => s.sale.lines)`, nunca `useSaleStore()` entero. Valores derivados (total, nº de artículos) como **selectores** (`selectTotal`), nunca guardados en el estado.
- Estado inmutable (spread / funciones puras). Prohibido mutar.
- Exportar `initialSaleState` y una acción `reset()` para los tests (`useSaleStore.setState(initialSaleState)` en `beforeEach`).
- Sin `persist` (YAGNI; ver roadmap).

## 4. Formularios con React Hook Form + Zod

- Todo `<form>` usa `useForm({ resolver: zodResolver(Schema) })` dentro del **hook** del componente (patrón `useLoginPage` de task-manager), que devuelve `{ register, errors, submit }`.
- El schema vive en `schema/index.ts` junto al componente y es la **única** fuente de verdad de la validación (DRY): si hace falta validar fuera del form, se reutiliza el mismo schema con `safeParse`.
- Mensajes de error del schema = microcopy de `constants/messages`.
- Errores conectados por accesibilidad: `aria-invalid`, `aria-describedby` al id del mensaje, mensaje con `role="alert"`.
- Tras enviar: `reset()` y `setFocus('code')` (el input de código nunca pierde el foco).

## 5. Estilos con Tailwind v4

- Tokens de Figma en `@theme` de `src/index.css` (`--color-primary`, `--color-danger`, `--text-total`…). Las clases usan esos tokens: `bg-primary`, `text-total`.
- **Prohibido**: valores arbitrarios (`text-[#ff0000]`, `w-[317px]`), `var()` en `className`, `@apply` para crear clases tipo BEM. Si algo se repite → componente o token.
- Clases condicionales siempre con `cn()` de `@shared/utils/cn`.
- Variantes como objetos `variants` / `sizes` dentro del componente (patrón `Button` de task-manager).
- Foco: `focus-visible:ring-*` siempre; **nunca** `outline-none` sin un anillo visible.
- Importes con `tabular-nums` y alineados a la derecha.

## 6. Accesibilidad (requisito, no extra)

Objetivo **WCAG 2.2 AA**. Skill de referencia: `react-a11y`.
1. **HTML semántico primero**: `<button>`, `<form>`, `<table>` con `<caption>` y `<th scope>`, `<label>` real. Nada de `div` clicables.
2. **Teclado al 100 %**: todo se puede hacer sin ratón (ver atajos en `docs/02-casos-de-uso.md`). El orden de tabulación sigue el visual.
3. **Foco gestionado**: el input de código recupera el foco tras cada acción; los modales atrapan el foco, se cierran con `Esc` y lo devuelven al input.
4. **Anuncios**: "producto añadido / eliminado / venta finalizada" en una región `aria-live="polite"` (`use-announcer`); errores con `role="alert"`.
5. **Nombres accesibles**: botones de icono con `aria-label` ("Eliminar Leche entera 1L"); stepper con `aria-label` por línea.
6. **Contraste** ≥ 4.5:1 texto, ≥ 3:1 componentes; **no** comunicar solo con color (icono + texto en errores).
7. **Objetivos táctiles** ≥ 44×44 px.
8. **`prefers-reduced-motion`**: el resaltado del último producto no anima si el usuario lo pide.
9. **Verificación**: `jsx-a11y` en lint, queries por rol en tests, `@axe-core/playwright` en E2E sin violaciones `serious`/`critical`.

## 7. Principios y patrones

- **SOLID** (S: componente pinta / hook orquesta / model decide; O: variantes y composición; L: los `ui` propagan props nativas y `ref`; I: props mínimas; D: la UI depende de hooks, no de Axios).
- **DRY** (dinero, errores HTTP, atajos, validaciones: un único sitio) · **KISS** · **YAGNI** (solo lo de `docs/02-casos-de-uso.md`).
- **React Compiler**: no escribir `useMemo`, `useCallback` ni `React.memo` salvo medición que lo justifique.
- Si una prop baja más de 3 niveles → store o contexto.

| Patrón | Dónde |
|---|---|
| Container / Presentational | `screen/index.tsx` + su hook orquestan; `components/` pintan |
| Custom Hook | Un hook por componente con lógica (`hooks/index.ts`) |
| Store (Flux ligero) | `store/` Zustand con acciones de dominio |
| Repository / Adapter | `services/` + `core/http` aíslan el backend; MSW lo sustituye |
| DTO + Mapper | `services/dtos` + `services/mappers` |
| Value Object | `models/money`, `models/product-code`, `models/quantity` |
| Interceptor | `core/interceptors` |
| Barrel / Public API | `shared/components/ui/index.ts`, `features/x/index.ts` |
| Observer | toasts (`sonner`) y anuncios `aria-live` |

## 8. Reglas de código

- TypeScript `strict`, **prohibido `any`** (`unknown` + narrowing). Prohibido `@ts-ignore`.
- **Dinero en céntimos enteros** dentro del front; conversión solo en mappers; formato solo con `@shared/utils/format-money`.
- Sin números mágicos: `constants/limits`. Sin textos sueltos: `constants/messages`.
- Componentes funcionales con `React.FC` tipado o props tipadas; `forwardRef` en los `ui` que envuelven nativos.
- **TSDoc** en APIs públicas (`core/http`, services, mappers, store, hooks compartidos). Skill: `web-tsdoc`.
- Sin `console.log` en código entregado.
- Componentes ≤ ~150 líneas; si crece, se extrae.
- Prettier: `semi`, `singleQuote`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`.

## 9. Testing (obligatorio)

| Nivel | Qué | Archivo | Proyecto Vitest |
|---|---|---|---|
| **Unit** | **Happy path** de cada componente, hook, model, mapper, service, store, util | `index.test.ts(x)` junto al archivo | `unit` |
| **Integración** | La screen completa con services reales contra **MSW**: éxito, 404, 500, red caída | `screen/index.integration.test.tsx` | `integration` |
| **E2E** | **Solo flujos críticos** (`docs/05-testing.md`) | `e2e/*.spec.ts` | Playwright |

Reglas (estilo task-manager):
- Patrón **AAA** con comentarios `// Arrange`, `// Act`, `// Assert`.
- `describe('<Capa>: <nombre>')` → `'UI: button'`, `'Checkout: useScanForm'`, `'Checkout: Screen Integration'`.
- Nombres `it('should <resultado> [when <condición>]')`.
- `@fileoverview` TSDoc en cada archivo de test.
- Queries por rol/label; `data-testid` solo como último recurso. `user-event`, nunca `fireEvent`.
- **Unit de hooks**: se pueden mockear sus services con `vi.mock`. **Integración**: la red **solo** con MSW (`onUnhandledRequest: 'error'`), nunca mocks de Axios ni del store.
- Store: `useSaleStore.setState(initialSaleState)` en `beforeEach`.
- Cobertura ≥ 80 % (lines/functions/branches/statements).

## 10. Flujo de trabajo del agente

1. Leer el doc relevante de `docs/` antes de tocar código.
2. Usar las skills del proyecto: `new-feature`, `new-component`, `new-service`, `write-tests`, `update-ai-log`, y las de tecnología (`react-core`, `react-zustand`, `react-hook-form-zod`, `react-tanstack-query`, `react-zod`, `react-a11y`, `web-tailwind`, `web-typescript-react`, `web-tsdoc`, `web-modern-testing`, `clean-code`, `conventional-commits`…).
3. Cada cambio: código + tests + `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test`.
4. Commits con Conventional Commits (`feat(checkout): …`). **No commitear sin que el usuario lo pida.**
5. **Al terminar cada petición, actualizar [`AI_LOG.md`](AI_LOG.md)** con la skill `update-ai-log` (fecha y hora, prompt resumido, qué se hizo, decisiones y correcciones). Es entregable de la prueba.
