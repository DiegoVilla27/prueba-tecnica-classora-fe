---
name: new-service
description: Añade una llamada al backend en una feature siguiendo el patrón de task-manager (httpService + funciones xxxSvc) con DTOs request/response (Zod), mapper DTO⇄modelo, hook TanStack Query, handler MSW y tests. Usar para cualquier endpoint.
---

# new-service

Cadena: `hook (TanStack Query) → xxxSvc → httpService (core/http) → axios → Zod.parse → mapper → modelo`.
La UI nunca ve un DTO.

## 1. Contrato
Sale de `prueba-tecnica-classora-be/docs/04-api.md`. Si no coincide → avisar, no inventar.

## 2. DTO de respuesta — `services/dtos/response/index.ts` (named)
```ts
import { z } from 'zod';

export const ProductResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
});
export type ProductResponseDto = z.infer<typeof ProductResponseSchema>;
```

## 3. DTO de request — `services/dtos/request/index.ts` (named, solo `type`)
Nunca enviar precios ni totales.

## 4. Mapper — `services/mappers/index.ts` (named)
```ts
/** Maps the API product (price in euros) to the domain model (price in cents). */
export const toProduct = (dto: ProductResponseDto): Product => ({
  code: dto.code,
  name: dto.name,
  unitPrice: Math.round(dto.price * 100),
});
```

## 5. Servicio — `services/index.ts` (named, sufijo `Svc`)
```ts
import { httpService } from '@core/http';
import { isApiError } from '@core/errors/api-error';

const API_PRODUCTS = '/products';

const getProductByCodeSvc = async (code: string): Promise<Product> => {
  try {
    const data = await httpService.get<unknown>(`${API_PRODUCTS}/${encodeURIComponent(code)}`);
    return toProduct(ProductResponseSchema.parse(data));
  } catch (error) {
    if (isApiError(error) && error.status === 404) throw new ProductNotFoundError(code);
    throw error;
  }
};

export { getProductByCodeSvc };
```
- Errores HTTP relevantes → errores de dominio con nombre.
- Sin estado, sin React. TSDoc en cada función.

## 6. Hook — `hooks/use-xxx/index.ts` (default) — skill `react-tanstack-query`
- Lecturas: `useQuery`/`fetchQuery` con `queryKey: ['<recurso>', params]`, `staleTime` justificado, sin `retry` en 4xx.
- Escrituras sobre la venta: `useMutation` **optimista** con `mutationKey: ['sale']` y `scope: { id: 'sale' }` (patrón real en `checkout/hooks/use-sale-mutations`):
```ts
const changeQuantity = useMutation({
  mutationKey: ['sale'],
  scope: { id: 'sale' },
  // la línea se identifica por producto: el id real sale de serverSale cuando corre la petición
  mutationFn: ({ productId, quantity }) =>
    updateLineSvc(confirmedSaleId(), confirmedLineId(productId), { quantity }),
  onMutate: ({ productId, quantity }) =>
    store().applyOptimistic((s) => changeLineQuantity(s, lineIdOnScreen(s, productId), quantity)),
  onSuccess: (sale) => store().confirmSale(sale, queryClient.isMutating({ mutationKey: ['sale'] }) <= 1),
  onError: () => store().rollback(), // la pantalla muestra el error (inline o toast)
});
```
- Acciones irreversibles (finalizar, cancelar) **sin** `onMutate`: se espera la respuesta.
- Autenticación: no se toca en el hook; la pone `core/interceptors/jwt`.

## 7. Mock MSW — `mocks/handlers/index.ts` (default) y `mocks/data/index.ts` (named)
```ts
const handlersCatalog = [
  http.get('*/products/:code', ({ params }) => {
    const product = products.find((p) => p.code === params.code);
    return product
      ? HttpResponse.json(product)
      : HttpResponse.json(notFoundError('Product not found.'), { status: 404 });
  }),
];
export default handlersCatalog;
```
Los 500/red se fuerzan en cada test con `server.use(...)`. Si el recurso cambia (venta), el handler mantiene un estado en memoria con las mismas reglas que el back y se reinicia en `afterEach`.

## 8. Tests
- Unit happy path del **mapper** y del **servicio** (con el handler MSW por defecto).
- Integración del flujo en la screen (200 + errores).
