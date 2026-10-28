# 06 · Integración con el backend Java

> Parte 3 de la prueba ("cómo integrarías el frontend con un backend Java"). El servidor está documentado en `prueba-tecnica-classora-be/docs/`. Aquí solo lo que **afecta al front**.

## 1. Contrato consumido

Base URL: `environment.apiUrl` → `http://localhost:8080/api/v1`

| Uso en el front | Endpoint | Fase |
|---|---|---|
| Buscar producto al escanear | `GET /products/{code}` | 1 (MSW) y 2 |
| Abrir venta | `POST /sales` | 2 |
| Consultar venta | `GET /sales/{id}` | 2 |
| Añadir producto / sumar | `POST /sales/{id}/lines` `{ code, quantity }` | 2 |
| Cambiar cantidad | `PATCH /sales/{id}/lines/{lineId}` `{ quantity }` | 2 |
| Eliminar línea | `DELETE /sales/{id}/lines/{lineId}` | 2 |
| Finalizar | `PATCH /sales/{id}/complete` | 2 |

"Vaciar venta" en fase 2 = abrir una venta nueva (la anterior queda `OPEN` sin uso; ver roadmap del back).

## 2. Formato de error (único para toda la API, estilo task-manager)

```json
{
  "timestamp": "2026-10-28T14:32:15Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found.",
  "errors": []
}
```
`core/interceptors/errors` lo convierte en `ApiError { status, message, fieldErrors }` (`core/errors/api-error`).

| HTTP | Qué significa para la caja | UI |
|---|---|---|
| 400 | Código con formato inválido / body inválido | Mensaje inline "Código no válido" |
| 404 | Producto / venta / línea inexistente | "No existe ningún producto con el código…" |
| 409 | La venta ya no está abierta | Aviso + empezar venta nueva |
| 422 | Regla de dominio (cantidad > 999, venta vacía) | Mensaje inline |
| 5xx / red / timeout | Fallo técnico | "No se pudo conectar" + Reintentar. **Nunca** se pierde la venta local |

## 3. Cliente HTTP (patrón task-manager)
- `core/axios`: `axios.create({ baseURL: environment.apiUrl, timeout: 5000, headers: { 'Content-Type': 'application/json' } })`. Timeout corto: un escaneo no puede colgar la caja.
- `core/http`: `httpService.get/post/patch/delete<T>()` que desempaqueta `data`.
- `core/interceptors/errors`: normaliza a `ApiError`. **No** muestra toasts globales (ADR-10).
- `core/environments`: `environment.apiUrl`, `environment.useMocks`, `environment.envName` desde `.env.localhost` / `.env.dev` / `.env.prod`.
- Sin autenticación (el backend no la tiene en esta prueba). Si se añadiera: `core/interceptors/jwt` como en task-manager.

## 4. Dinero
El back envía `price: 0.95` (BigDecimal, escala 2). El **mapper** lo convierte a `95` céntimos con `Math.round(price * 100)`. El front nunca envía precios: en fase 2 envía **código + cantidad** y el servidor decide el precio (el cliente no puede manipular precios).

## 5. Fase 2: venta en servidor con UI optimista
1. El cajero escanea → `useSaleStore` añade la línea al instante (feedback < 100 ms).
2. En paralelo `POST /sales/{id}/lines` (mutation de TanStack Query).
3. OK → se reemplaza la venta del store por el `SaleResponseDto` mapeado (fuente de verdad).
4. KO → *rollback* al snapshot previo del store + mensaje.

Las mutaciones de una venta se **serializan** (cola) para respetar el orden de escaneo.

## 6. CORS y entornos
El backend permite `http://localhost:[*]`. Alternativa en desarrollo: *proxy* de Vite (`/api → :8080`).

| Archivo | `VITE_USE_MOCKS` | `VITE_API_URL` |
|---|---|---|
| `.env.localhost` | `true` (por defecto) | `http://localhost:8080/api/v1` |
| `.env.dev` | `false` | `http://localhost:8080/api/v1` (backend en docker) |
| `.env.prod` | `true` | — (demo desplegada sin backend) |
