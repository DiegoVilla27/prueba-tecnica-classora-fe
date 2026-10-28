---
name: new-feature
description: Crea el esqueleto de una feature (models, services con dtos/mappers, store Zustand, hooks, mocks MSW, screen) con su API pública index.ts. Usar al empezar un área funcional nueva.
---

# new-feature

## 0. Antes
- ¿Está en `docs/02-casos-de-uso.md`? Si no → YAGNI, preguntar.
- Nombre en kebab-case singular de negocio (`checkout`, `catalog`).

## 1. Estructura (crear solo lo que se use ya)
```
src/features/<feature>/
├── index.ts                     # API pública (named re-exports)
├── models/<concepto>/index.ts   # tipos + funciones puras de dominio
├── services/                    # skill new-service
│   ├── index.ts
│   ├── dtos/{request,response}/index.ts
│   └── mappers/index.ts
├── store/index.ts               # Zustand (si hay estado de cliente compartido)
├── hooks/<use-xxx>/index.ts     # hooks globales de la feature
├── components/<name>/           # componentes globales de la feature
├── constants/{limits,messages}/index.ts
├── mocks/{data,handlers}/index.ts
└── screen/
    ├── index.tsx                # <XxxScreen> (named + default)
    ├── index.test.tsx
    ├── index.integration.test.tsx
    ├── hooks/index.ts           # useXxxScreen (default)
    └── components/
```

## 2. Store Zustand (si aplica) — skill `react-zustand`
```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SaleState { sale: Sale; lastAddedCode: string | null; … }
export interface SaleActions { addProduct: (p: Product, q?: number) => void; reset: () => void; … }

export const initialSaleState: SaleState = { sale: createEmptySale(), lastAddedCode: null, … };

const useSaleStore = create<SaleState & SaleActions>()(
  devtools(
    (set) => ({
      ...initialSaleState,
      addProduct: (product, quantity = 1) =>
        set((s) => ({ sale: addProductToSale(s.sale, product, quantity), lastAddedCode: product.code })),
      reset: () => set(initialSaleState),
    }),
    { name: 'sale', enabled: import.meta.env.DEV },
  ),
);

export const selectTotal = (s: SaleState) => saleTotal(s.sale);
export default useSaleStore;
```
- Lógica de negocio en `models/` (puras); el store solo las llama.
- Consumir con selecciones atómicas: `useSaleStore((s) => s.sale.lines)`, `useSaleStore(selectTotal)`.

## 3. Pasos
1. `models/` + unit (TDD).
2. `services/` con `new-service` + mocks MSW, y registrar los handlers en `core/mocks/handlers` y `shared/mocks/server`.
3. `store/` + unit (`setState(initialState)` en `beforeEach`).
4. Screen y componentes con `new-component`.
5. Integración de la screen con MSW.
6. Si es flujo crítico → spec Playwright.
7. `index.ts` público y regla de frontera en oxlint (`no-restricted-imports`).
8. Entrada en `AI_LOG.md` (`update-ai-log`).
