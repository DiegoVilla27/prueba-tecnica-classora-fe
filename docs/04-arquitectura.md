# 04 · Arquitectura del Frontend

> Las reglas obligatorias están en [`CLAUDE.md`](../CLAUDE.md). Este documento explica **qué** hay, **por qué** y **cómo encaja**.
> Base: la forma de trabajo de `task-manager-client` (features, `index` por carpeta, Axios + `httpService` + interceptores JWT, React Router con guards, RHF + Zod, Zustand, Tailwind v4, Vitest unit/integration, MSW).

## 1. Visión general

```
     main.tsx (interceptores · MSW opcional) → core/router (guards) → core/providers
                                   │
     ┌──────────────────────────── features ─────────────────────────────────────┐
     │  auth                     checkout                          catalog        │
     │  ├─ screen/ (login)        ├─ screen/ (caja)                 ├─ services/   │
     │  ├─ services/ (login,      ├─ store/ (useSaleStore)          ├─ hooks/      │
     │  │   refresh, logout)      ├─ services/ (sales API)          │  (lookup)    │
     │  └─ hooks/                 ├─ hooks/ (mutations de venta)    └─ models/     │
     │                            └─ models/ (sale, money…)                        │
     └──────────────────────────────────┬─────────────────────────────────────────┘
                                        │
     shared (components/ui · hooks: use-me, use-hotkeys, use-announcer · utils: cn, format-money, storage)
                                        │
     core (axios · http · interceptors errors/jwt · router · environments · providers · mocks)
```

### Features
| Feature | Responsabilidad | Bounded context del back |
|---|---|---|
| `auth` | Login, sesión, logout | `auth` + `user` |
| `checkout` | La caja: venta en curso y sus acciones | `sale` |
| `catalog` | Buscar producto por código (con caché) | `product` |

### ¿Por qué `index` por carpeta y kebab-case?
Imports cortos, co-localización (componente + test + hook + schema) y la misma convención que task-manager. Para no perderse entre pestañas `index.tsx`: `.vscode/settings.json` → `"workbench.editor.customLabels.patterns": { "**/index.{ts,tsx}": "${dirname}" }`.

## 2. Rutas y sesión

| Ruta | Guard | Screen |
|---|---|---|
| `/login` | `public` (si hay sesión → `/`) | `auth/screen` |
| `/` | `private` (sin sesión → `/login`) | `checkout/screen` |
| `*` | — | redirige a `/` |

- Screens cargadas con `React.lazy` (por eso exportan **default**) dentro de `<Suspense>`.
- Tokens en `shared/utils/storage` (`TOKEN`, `REFRESH`), igual que task-manager.
- `core/interceptors/jwt`: añade `Bearer`; ante 401 hace **un** `POST /auth/refresh` (las peticiones concurrentes esperan en cola) y reintenta; si falla → limpia sesión y navega a `/login?expired=1`.
- `shared/hooks/use-me`: `GET /users/me` (TanStack Query) para la cabecera ("Cajero: Ana López").

> ⚠️ Tokens en `localStorage`, como en task-manager: es lo pragmático para una SPA en otro dominio que la API. El riesgo de XSS se mitiga con React (sin `dangerouslySetInnerHTML`) y CSP en Vercel. Alternativa más segura, para la entrevista: refresh token en cookie `HttpOnly` + `SameSite`.

## 3. Árbol objetivo

```
src/
├── main.tsx
├── index.css                                   # @import 'tailwindcss'; @theme { tokens }
├── setupTests.ts
├── core/
│   ├── axios/index.ts                          # axiosInstance (baseURL, timeout, JSON)
│   ├── http/index.ts                           # httpService.get/post/patch/delete<T>
│   ├── interceptors/
│   │   ├── errors/index.ts                     # AxiosError → ApiError
│   │   └── jwt/index.ts                        # Bearer + refresh silencioso
│   ├── errors/api-error/index.ts
│   ├── router/
│   │   ├── index.tsx                           # <AppRoutes /> (RouterProvider)
│   │   ├── config/index.tsx                    # createBrowserRouter + lazy screens
│   │   ├── private/index.tsx                   # PrivateGuard
│   │   └── public/index.tsx                    # PublicGuard
│   ├── environments/index.ts                   # { apiUrl, useMocks, envName }
│   ├── providers/index.tsx                     # QueryClientProvider + <Toaster />
│   └── mocks/{browser,handlers}/index.ts
├── shared/
│   ├── components/ui/                          # button, icon-button, input, quantity-stepper, money,
│   │   └── index.ts                            # alert, modal, kbd, empty-state, spinner (+ barrel)
│   ├── hooks/{use-me, use-hotkeys, use-announcer}/index.ts(x)
│   ├── utils/{cn, format-money, storage}/index.ts
│   └── mocks/
│       ├── server/index.ts                     # setupServer para tests
│       └── data/index.ts                       # usuarios demo, tokens falsos
├── features/
│   ├── auth/
│   │   ├── index.ts                            # export { LoginScreen, useLogout }
│   │   ├── services/
│   │   │   ├── index.ts                        # loginSvc, refreshSvc, logoutSvc
│   │   │   └── dtos/{request,response}/index.ts
│   │   ├── hooks/use-logout/index.ts
│   │   ├── mocks/handlers/index.ts
│   │   └── screen/
│   │       ├── index.tsx                       # LoginScreen
│   │       ├── index.integration.test.tsx
│   │       ├── hooks/index.ts                  # useLoginScreen (RHF + Zod, como useLoginPage)
│   │       └── schema/index.ts                 # LoginSchema
│   ├── catalog/
│   │   ├── index.ts                            # export { useProductLookup, type Product, ProductNotFoundError }
│   │   ├── models/product/index.ts
│   │   ├── errors/product-not-found/index.ts
│   │   ├── hooks/use-product-lookup/index.ts   # queryClient.fetchQuery con caché por código
│   │   ├── services/{index.ts, dtos/response/index.ts, mappers/index.ts}
│   │   └── mocks/{data,handlers}/index.ts
│   └── checkout/
│       ├── index.ts                            # export { CheckoutScreen }
│       ├── constants/{limits,messages}/index.ts
│       ├── models/{money, quantity, sale-line, sale}/index.ts
│       ├── store/index.ts                      # useSaleStore + selectores + initialSaleState
│       ├── services/
│       │   ├── index.ts                        # openSaleSvc, getCurrentSaleSvc, addLineSvc, updateLineSvc,
│       │   │                                   # removeLineSvc, completeSaleSvc, cancelSaleSvc
│       │   ├── dtos/{request,response}/index.ts
│       │   └── mappers/index.ts                # toSale(dto): euros → céntimos
│       ├── hooks/
│       │   ├── use-current-sale/index.ts       # GET current → si 404, POST /sales → store
│       │   └── use-sale-mutations/index.ts     # add/update/remove/complete/cancel optimistas
│       ├── mocks/{data,handlers}/index.ts      # venta en memoria para MSW
│       └── screen/
│           ├── index.tsx                       # CheckoutScreen
│           ├── index.integration.test.tsx
│           ├── hooks/index.ts                  # useCheckoutScreen: atajos, modales, foco
│           └── components/
│               ├── checkout-header/            # cajero + cerrar sesión
│               ├── scan-form/                  # index.tsx · hooks/ · schema/
│               ├── sale-table/  sale-line-row/  total-panel/
│               ├── finalize-sale-modal/  clear-sale-modal/  sale-completed/
│               ├── server-status/              # "Conectando con el servidor…" (cold start)
│               └── shortcuts-bar/
e2e/
├── mocked/      # contra MSW (deterministas)
└── full-stack/  # contra la API real (docker en CI)
```

## 4. Dominio en el front

```ts
// models/money        type Money = number (céntimos) · add · multiply
// models/quantity     MIN_QUANTITY · MAX_QUANTITY · clampQuantity · isValidQuantity
// models/sale-line    { id, productId, code, name, unitPrice: Money, quantity } · lineSubtotal
// models/sale         { id, status, version, lines }
//                     addProductToSale · changeLineQuantity · removeLine · restoreLine · saleTotal · itemCount
```
Son las **mismas reglas** que el agregado del back, en funciones puras, para el **feedback optimista**. La respuesta del servidor manda siempre.

## 5. Venta: Zustand + mutations optimistas

```ts
interface SaleState {
  sale: Sale | null;              // null mientras se carga/abre la venta
  lastAddedCode: string | null;   // resaltar + scroll
  selectedLineId: string | null;  // navegación ↑↓
  lastRemoved: RemovedLine | null;// deshacer
}
// acciones: setSale, applyOptimistic(fn), rollback(snapshot), selectLine, markAdded, reset
```

```ts
// hooks/use-sale-mutations (extracto)
const addLine = useMutation({
  scope: { id: 'sale' },                                   // serializa con el resto de mutaciones
  mutationFn: ({ product, quantity }) => addLineSvc(saleId, { code: product.code, quantity }),
  onMutate: ({ product, quantity }) => {
    const snapshot = useSaleStore.getState().sale;
    useSaleStore.getState().applyOptimistic((s) => addProductToSale(s, product, quantity));
    return { snapshot };
  },
  onSuccess: (sale) => useSaleStore.getState().setSale(sale),       // reconciliación
  onError: (_e, _v, ctx) => useSaleStore.getState().rollback(ctx?.snapshot),
});
```

| Acción del cajero | Optimista | Petición | Al confirmar |
|---|---|---|---|
| Escanear | `addProductToSale` | `POST /sales/{id}/lines` | venta del servidor |
| Cambiar cantidad | `changeLineQuantity` | `PATCH …/lines/{lineId}` | ídem |
| Eliminar | `removeLine` (+ guarda `lastRemoved`) | `DELETE …/lines/{lineId}` | ídem |
| Deshacer | `restoreLine` | `POST …/lines` con código y cantidad | ídem |
| Finalizar | — (espera respuesta) | `PATCH …/complete` | pantalla de éxito → nueva venta |
| Vaciar | — (espera respuesta) | `PATCH …/cancel` → `POST /sales` | venta nueva |

- **¿Por qué Zustand si el servidor es la fuente de verdad?** La venta en pantalla la leen varios componentes (formulario, tabla, total, atajos) y cambia en cada escaneo. Zustand da selecciones atómicas y un sitio claro para el estado optimista y de UI. TanStack Query se encarga del transporte, la serialización y los reintentos.
- Finalizar y vaciar **no** son optimistas: son irreversibles y el cajero debe ver la confirmación real.

## 6. Escaneo: lookup + línea

1. `scan-form` (RHF + Zod) valida el formato y separa el multiplicador (`6*8410001000011`).
2. `use-product-lookup`: `GET /products/{code}` con caché de 5 min. Un 404 se muestra **inline** y no se toca la venta.
3. Con el producto (nombre y precio) → mutation `addLine` optimista.
4. `reset()` + `setFocus('code')` + anuncio `aria-live`.

## 7. Formularios (RHF + Zod)
- `auth/screen`: `LoginSchema` (email válido, contraseña requerida) en `useLoginScreen`, igual que `useLoginPage` de task-manager. Si llega `?expired=1`, aviso "Tu sesión ha caducado".
- `scan-form`: `ScanSchema` (ver §6).
- Cantidad en línea: no es `<form>`; reutiliza `QuantitySchema` con `safeParse` (DRY).

## 8. Servicios, DTOs y mappers
Contratos en `prueba-tecnica-classora-be/docs/04-api.md`. Cadena: `xxxSvc → httpService → axios → Zod.parse → mapper → modelo`. Los componentes nunca ven DTOs; el dinero pasa a céntimos en el mapper.

## 9. Resiliencia
- **Arranque en frío de Render** (plan gratuito, unos 50 s): `server-status` muestra "Conectando con el servidor…" con spinner accesible (`role="status"`) mientras `use-current-sale` reintenta (backoff, máximo 60 s). El input queda deshabilitado hasta tener venta.
- **Errores de red** en una mutación → rollback + mensaje con "Reintentar"; la venta en pantalla nunca queda en un estado que el servidor no tenga.
- **409** (venta ya cerrada o conflicto de versión) → recargar `GET /sales/current` y avisar.

## 10. Decisiones (ADRs)

| # | Decisión | Alternativas | Motivo |
|---|---|---|---|
| ADR-01 | Features + `index` por carpeta, kebab-case | Por tipo | Forma de trabajo del autor; cohesión |
| ADR-02 | Zustand para la venta en pantalla + mutations optimistas | Solo TanStack Query cache; `useReducer` | Selecciones atómicas; estado optimista/UI explícito |
| ADR-03 | TanStack Query para peticiones (`scope` para serializar) | `useEffect` | Caché, reintentos, orden garantizado |
| ADR-04 | Axios + interceptores (errors, jwt) | `fetch` | Patrón de task-manager; refresh silencioso |
| ADR-05 | React Router 7 + guards | Estado condicional | Login + caja; mismo patrón que task-manager |
| ADR-06 | RHF + Zod | Estado controlado | Menos renders, schema reutilizable |
| ADR-07 | Tailwind v4 `@theme` | CSS Modules | Tokens de Figma → clases |
| ADR-08 | Céntimos enteros | decimales | Exactitud |
| ADR-09 | MSW en tests, desarrollo offline y E2E `mocked` | Mocks a mano | Un solo mock a nivel de red |
| ADR-10 | Errores de producto inline, no toast global | Toast en interceptor | El error debe estar donde mira el cajero |
| ADR-11 | Finalizar/vaciar no optimistas | Todo optimista | Irreversibles: confirmación real |
| ADR-12 | Playwright (mocked + full-stack) | Cypress | Pedido del autor; axe integrado |
