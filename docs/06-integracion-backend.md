# 06 · Integración con el backend Java

> Responde a la Parte 3 de la prueba **con un sistema real**: el front consume la API Spring Boot (`prueba-tecnica-classora-be`) en local, docker, dev y prod. Contratos completos en `prueba-tecnica-classora-be/docs/04-api.md`.

## 1. Endpoints consumidos

| Uso en el front | Endpoint | Dónde |
|---|---|---|
| Iniciar sesión | `POST /auth/login` | `auth/services` → `loginSvc` |
| Renovar token | `POST /auth/refresh` | `core/interceptors/jwt` (llamada directa, fuera de los interceptores) |
| Cajero en cabecera | `GET /users/me` | `auth/hooks/use-me` (por `@features/auth`) |
| Buscar producto | `GET /products/{code}` | `catalog/services` → `getProductByCodeSvc` |
| Recuperar venta abierta | `GET /sales/current` | `checkout/hooks/use-current-sale` |
| Abrir venta | `POST /sales` | ídem |
| Escanear | `POST /sales/{id}/lines` | `use-sale-mutations` |
| Cambiar cantidad | `PATCH /sales/{id}/lines/{lineId}` | ídem |
| Eliminar línea | `DELETE /sales/{id}/lines/{lineId}` | ídem |
| Finalizar | `PATCH /sales/{id}/complete` | ídem |
| Vaciar | `PATCH /sales/{id}/cancel` + `POST /sales` | ídem |

## 2. Errores

Formato único (`ErrorResponseDTO`):
```json
{ "timestamp": "…", "status": 404, "error": "Not Found", "message": "Product not found.", "errors": [] }
```
`core/interceptors/errors` → `ApiError { status, message, fieldErrors }`.

| HTTP | Significado | UI |
|---|---|---|
| 400 | Formato inválido | Mensaje inline |
| 401 | Token caducado / credenciales | Refresh silencioso una vez; si falla → `/login?expired=1`. En login: "Email o contraseña incorrectos" |
| 403 | Venta ajena | Toast "No tienes permiso" + recargar venta actual |
| 404 | Producto inexistente / sin venta abierta | Inline "No existe ningún producto con el código…" / abrir venta nueva |
| 409 | Venta cerrada o conflicto de versión | Recargar `GET /sales/current` + aviso |
| 422 | Regla de dominio (cantidad, venta vacía) | Mensaje inline |
| 429 | Rate limit | "Demasiadas peticiones, espera un momento" |
| 5xx / red / timeout | Fallo técnico | Rollback + "No se pudo conectar" + Reintentar |

## 3. Cliente HTTP (patrón task-manager)
- `core/axios`: `baseURL = environment.apiUrl`, `timeout: 10000` (cubre el arranque en frío en las peticiones normales), JSON.
- `core/http`: `httpService` tipado que desempaqueta `data`.
- `core/interceptors/jwt`: `Authorization: Bearer <TOKEN>`; 401 → refresh único con cola → reintento.
- `core/interceptors/errors`: normaliza a `ApiError`, sin toasts globales.

## 4. Dinero
El back envía decimales (`0.95`); los mappers los pasan a céntimos con `fromEuros` de `@shared/utils/money` (`Math.round(x * 100)`, un único sitio). El front **nunca** envía precios: solo código y cantidad.

## 5. Flujo completo de una venta
1. Login → tokens en storage → `/`.
2. `use-current-sale`: `GET /sales/current` → 200 (se recupera) o 404 → `POST /sales`.
3. Escanear: lookup (caché) → `addLine` optimista → reconciliación.
4. Finalizar: modal → `PATCH complete` → éxito → `POST /sales` (nueva venta).
5. Cerrar sesión: limpiar storage y caché de TanStack Query → `/login`. La venta abierta queda en el servidor y se recupera en el siguiente login.

## 6. Entornos

| Modo / entorno | `VITE_API_URL` | `VITE_USE_MOCKS` |
|---|---|---|
| `pnpm local` (`.env.localhost`) | `http://localhost:8080/api/v1` | `false` |
| `pnpm local:mock` (`.env.mock`) | — | `true` (MSW: desarrollo sin backend; el worker solo existe en este build) |
| Docker (`docker-compose.yml`) | `http://localhost:8080/api/v1` | `false` |
| Vercel **dev** (rama `dev`) | API Render dev | `false` |
| Vercel **prod** (rama `main`) | API Render prod | `false` |

CORS: el back permite `http://localhost:[*]` y los dominios de Vercel de cada entorno (`CORS_ALLOWED_ORIGINS`).
