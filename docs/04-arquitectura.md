# 04 · Arquitectura del Frontend

> Las reglas obligatorias están en [`CLAUDE.md`](../CLAUDE.md). Este documento explica **qué** hay, **por qué** y **cómo encaja**.
> Base: la forma de trabajo de `task-manager-client` (features, `index` por carpeta, Axios + `httpService`, RHF + Zod, Zustand, Tailwind v4, Vitest unit/integration, MSW).

## 1. Visión general

```
                         main.tsx  (interceptores · MSW worker · providers)
                              │
          ┌───────────────────┴──────────── features ───────────────────────────┐
          │  checkout                                 catalog                    │
          │  ├─ screen/   (UI + hooks de la pantalla)  ├─ services/ (getProductByCodeSvc)
          │  ├─ store/    (useSaleStore · Zustand)     ├─ hooks/    (use-product-lookup · TanStack Query)
          │  ├─ models/   (sale, money, quantity…)     ├─ models/   (product)
          │  └─ constants/ mocks/                      └─ mocks/    (MSW)
          └───────────────────┬─────────────────────────────────────────────────┘
                              │
       shared  (components/ui · hooks · utils/cn · utils/format-money · mocks/server)
                              │
       core    (axios · http · interceptors · environments · providers · mocks)
```

### ¿Por qué por features?
- **Cohesión**: todo lo de "cobrar" está junto; mover o borrar una feature es mover una carpeta.
- **Escalabilidad**: añadir `auth` o `returns` no toca `checkout`.
- **Fronteras explícitas**: cada feature expone un `index.ts` público.

### ¿Por qué `checkout` y `catalog` separados?
Son *bounded contexts* distintos también en el backend (`product` vs `sale`). El catálogo es de solo lectura para la caja y mañana lo puede usar otra feature (búsqueda manual, inventario).

### ¿Por qué `index` por carpeta?
Imports cortos (`./components/sale-table`), co-localización (componente + test + hook + schema juntos), mover = mover carpeta. *Trade-off*: muchas pestañas `index.tsx` → `.vscode/settings.json` con `"workbench.editor.customLabels.patterns": { "**/index.{ts,tsx}": "${dirname}" }`.

## 2. Árbol objetivo

```
src/
├── main.tsx
├── index.css                                   # @import 'tailwindcss'; @theme { tokens }
├── setupTests.ts
├── core/
│   ├── axios/index.ts                          # axiosInstance (baseURL, timeout 5 s, JSON)
│   ├── http/index.ts                           # httpService.get/post/patch/delete<T>
│   ├── interceptors/errors/index.ts            # AxiosError → ApiError {status, message, fieldErrors}
│   ├── errors/api-error/index.ts               # clase ApiError (+ isApiError)
│   ├── environments/index.ts                   # environment { apiUrl, useMocks, envName }
│   ├── providers/index.tsx                     # QueryClientProvider + <Toaster />
│   └── mocks/
│       ├── browser/index.ts                    # setupWorker (dev / e2e)
│       └── handlers/index.ts                   # [...handlersCatalog, ...]
├── shared/
│   ├── components/ui/
│   │   ├── index.ts                            # barrel
│   │   ├── button/  icon-button/  input/  quantity-stepper/
│   │   ├── money/   alert/  modal/  kbd/  empty-state/
│   ├── hooks/
│   │   ├── use-hotkeys/index.ts
│   │   └── use-announcer/index.tsx             # provider + hook para aria-live
│   ├── utils/
│   │   ├── cn/index.ts
│   │   └── format-money/index.ts
│   └── mocks/server/index.ts                   # setupServer(...handlers) para tests
├── features/
│   ├── catalog/
│   │   ├── index.ts                            # export { useProductLookup, type Product, ProductNotFoundError }
│   │   ├── models/product/index.ts
│   │   ├── errors/product-not-found/index.ts
│   │   ├── hooks/use-product-lookup/index.ts   # queryClient.fetchQuery con caché por código
│   │   ├── services/
│   │   │   ├── index.ts                        # getProductByCodeSvc
│   │   │   ├── dtos/response/index.ts          # ProductResponseDto + ProductResponseSchema (Zod)
│   │   │   └── mappers/index.ts                # toProduct(dto): euros → céntimos
│   │   └── mocks/
│   │       ├── data/index.ts                   # ~20 productos ficticios (EAN-13)
│   │       └── handlers/index.ts               # GET */products/:code → 200 | 404 | 400
│   └── checkout/
│       ├── index.ts                            # export { CheckoutScreen }
│       ├── constants/
│       │   ├── limits/index.ts                 # MAX_QUANTITY, CODE_PATTERN, UNDO_TIMEOUT_MS…
│       │   └── messages/index.ts
│       ├── models/
│       │   ├── money/index.ts                  # add, multiply (céntimos)
│       │   ├── quantity/index.ts               # clamp, isValidQuantity
│       │   ├── sale-line/index.ts              # tipo + lineSubtotal
│       │   └── sale/index.ts                   # tipo Sale + addProductToSale, changeLineQuantity,
│       │                                       # removeLine, restoreLine, completeSale, saleTotal, itemCount
│       ├── store/index.ts                      # useSaleStore (default) + selectores + initialSaleState
│       └── screen/
│           ├── index.tsx                       # CheckoutScreen
│           ├── index.test.tsx
│           ├── index.integration.test.tsx
│           ├── hooks/index.ts                  # useCheckoutScreen: atajos, modales, foco
│           └── components/
│               ├── scan-form/                  # index.tsx · hooks/ (useScanForm: RHF+Zod+lookup+store) · schema/
│               ├── sale-table/                 # index.tsx (tabla semántica, selección ↑↓)
│               ├── sale-line-row/              # index.tsx · hooks/ (cantidad, eliminar)
│               ├── total-panel/                # index.tsx
│               ├── finalize-sale-modal/        # index.tsx · hooks/
│               ├── clear-sale-modal/           # index.tsx
│               ├── sale-completed/             # index.tsx
│               └── shortcuts-bar/              # index.tsx
e2e/
├── checkout-happy-path.spec.ts
├── checkout-unknown-code.spec.ts
├── checkout-remove-undo.spec.ts
└── checkout-keyboard-a11y.spec.ts
```

## 3. Dominio en el front (DDD táctico ligero)

Replicamos **lo justo** para que la UI sea correcta y testeable sin red:

```ts
// models/money        type Money = number (céntimos enteros) · add(a, b) · multiply(m, q)
// models/quantity     MIN_QUANTITY=1 · MAX_QUANTITY=999 · clampQuantity(n) · isValidQuantity(n)
// models/sale-line    { code, name, unitPrice: Money, quantity } · lineSubtotal(line)
// models/sale         { status: 'OPEN' | 'COMPLETED', lines: SaleLine[] }
//                     addProductToSale(sale, product, qty): Sale   ← RN-01, RN-02, RN-05
//                     changeLineQuantity(sale, code, qty): Sale     ← RN-02
//                     removeLine(sale, code): { sale, removed }     ← guarda línea + posición
//                     restoreLine(sale, removed): Sale
//                     completeSale(sale): Sale                      ← RN-06, RN-07
//                     saleTotal(sale): Money · itemCount(sale): number
```
Todas son **funciones puras** (entrada → nueva salida, sin mutar). Son el núcleo testeable.

## 4. Store Zustand (`checkout/store`)

```ts
interface SaleState {
  sale: Sale;
  lastAddedCode: string | null;   // resaltar + scroll
  selectedCode: string | null;    // navegación con ↑↓
  lastRemoved: RemovedLine | null;// deshacer
}
interface SaleActions {
  addProduct: (product: Product, quantity?: number) => void;
  changeQuantity: (code: string, quantity: number) => void;
  removeLine: (code: string) => void;
  undoRemove: () => void;
  selectLine: (code: string | null) => void;
  clearSale: () => void;
  completeSale: () => Sale;       // devuelve la venta cerrada para la pantalla de éxito
  reset: () => void;
}
export const initialSaleState: SaleState = { … };
const useSaleStore = create<SaleState & SaleActions>()(devtools((set, get) => ({
  ...initialSaleState,
  addProduct: (product, quantity = 1) =>
    set((s) => ({ sale: addProductToSale(s.sale, product, quantity), lastAddedCode: product.code })),
  …
})));
export const selectTotal = (s: SaleState) => saleTotal(s.sale);
export const selectItemCount = (s: SaleState) => itemCount(s.sale);
export default useSaleStore;
```
- **Por qué Zustand**: estado de cliente compartido por varios componentes (formulario, tabla, panel de total, atajos) sin *provider hell* y con selecciones atómicas → solo re-renderiza lo que cambia (el total no re-renderiza la tabla). Mismo criterio que task-manager.
- **Por qué funciones puras en `models/` y no la lógica dentro del store**: el dominio se testea sin store; el store queda como fina capa de estado.
- **Total derivado** vía selector → imposible que se desincronice.

## 5. Formularios (RHF + Zod)

### `scan-form`
```ts
// schema/index.ts
const ScanSchema = z.object({
  code: z.string().trim()
    .min(1, MESSAGES.codeRequired)
    .regex(SCAN_INPUT_PATTERN, MESSAGES.codeInvalid),   // "8410001000011" o "6*8410001000011"
});
export default ScanSchema;

// hooks/index.ts  (useScanForm)
const { register, handleSubmit, reset, setFocus, setError, formState: { errors } } =
  useForm<ScanFormValues>({ resolver: zodResolver(ScanSchema), defaultValues: { code: '' } });
const onSubmit = async ({ code }) => {
  const { quantity, productCode } = parseScanInput(code);
  try {
    const product = await lookup(productCode);          // use-product-lookup (TanStack Query)
    addProduct(product, quantity);                      // store
    announce(MESSAGES.added(product.name, …));
    reset(); setFocus('code');
  } catch (e) {
    setError('code', { message: e instanceof ProductNotFoundError ? MESSAGES.notFound(productCode) : MESSAGES.network });
  }
};
return { register, errors, submit: handleSubmit(onSubmit), isSubmitting };
```
- Un `Enter` vacío no muestra error (A1): `min(1)` se trata como no-op en `onSubmit` inválido.
- Escaneos rápidos: `isSubmitting` no bloquea el input; las peticiones se encadenan en una cola dentro del hook para respetar el orden.

### Cantidad en línea
No es un `<form>`: `quantity-stepper` (botones −/+ y input numérico). La validación reutiliza `QuantitySchema` (`z.coerce.number().int().min(1).max(999)`) con `safeParse` en `blur`/`Enter` (DRY con el dominio).

## 6. Servicios, DTOs y mappers

Contrato del backend (`prueba-tecnica-classora-be/docs/04-api.md`):
```http
GET /api/v1/products/{code}
200 → { "id": "uuid", "code": "8410001000011", "name": "Leche entera 1L", "price": 0.95 }
404 → { "timestamp": "...", "status": 404, "error": "Not Found", "message": "Product not found.", "errors": [] }
```

```
getProductByCodeSvc(code)                         features/catalog/services
  └─ httpService.get<unknown>(`/products/${code}`)     core/http → core/axios
  └─ ProductResponseSchema.parse(data)                 services/dtos/response   (Zod)
  └─ toProduct(dto)                                    services/mappers         (0.95 € → 95)
  └─ Product
errores: ApiError 404 → ProductNotFoundError · resto → ApiError (red/5xx)
```
- **Zod en la respuesta**: si cambia el contrato, falla en la frontera con un error claro.
- **Mapper**: aísla el formato del backend; si cambia, se toca un archivo.
- **TanStack Query** (`use-product-lookup`): `queryClient.fetchQuery({ queryKey: ['products', code], staleTime: 5 min })` → reescanear un producto no vuelve a la red (RNF-01). `retry: false` en 404.
- **Interceptor de errores**: a diferencia de task-manager, **no** lanza un toast global: en una caja el error de producto va **inline** junto al input. El interceptor solo normaliza a `ApiError`; cada hook decide cómo mostrarlo (inline, toast de `sonner` para errores generales).

## 7. Integración por fases

| Fase | Venta | Catálogo |
|---|---|---|
| **1 · Entrega** | Zustand en cliente | `GET /products/{code}` contra **MSW** |
| **2 · Con backend** | Servidor fuente de verdad (`/sales/*`), UI optimista con el store y reconciliación con la respuesta | API real |

Conmutación con `VITE_USE_MOCKS` y `VITE_API_URL` por modo (`.env.localhost`, `.env.dev`, `.env.prod`).

## 8. Decisiones (ADRs)

| # | Decisión | Alternativas | Motivo |
|---|---|---|---|
| ADR-01 | Features + `index` por carpeta, kebab-case | Por tipo; archivos nombrados | Forma de trabajo del autor (task-manager); cohesión |
| ADR-02 | **Zustand** para la venta | `useReducer`+Context, Redux | Selecciones atómicas, sin providers, poco boilerplate |
| ADR-03 | TanStack Query para productos | `useEffect` + `useState` | Caché, deduplicación, estados |
| ADR-04 | **Axios** + `httpService` + interceptores | `fetch` | Mismo patrón que task-manager; timeout e interceptores nativos |
| ADR-05 | **RHF + Zod** en formularios | Estado controlado a mano | Menos renders, validación declarativa, schema reutilizable |
| ADR-06 | **Tailwind v4** con `@theme` | CSS Modules | Tokens de Figma → clases; mismo stack que task-manager |
| ADR-07 | Céntimos enteros | decimales, decimal.js | Exactitud sin dependencias |
| ADR-08 | MSW en tests, dev y E2E | json-server, mocks a mano | Un solo mock a nivel de red |
| ADR-09 | Playwright para E2E | Cypress (task-manager) | Lo pide el equipo; axe integrado; multi-navegador |
| ADR-10 | Errores de producto inline, no toast global | Toast en interceptor | En caja el error debe estar donde mira el cajero |
| ADR-11 | Sin React Router | Router | Una sola pantalla (YAGNI) |

## 9. Atajos y foco: diseño técnico
- `use-hotkeys(map, { enabled })`: un listener en `window`, ignora teclas dentro de inputs salvo una whitelist (`F12`, `Esc`), se desactiva con modal abierto.
- `useCheckoutScreen` define el mapa de atajos (CU-06) y controla los modales.
- Foco: tras cada acción del store, el hook de la screen llama a `setFocus('code')`; los modales devuelven el foco al input al cerrar.
