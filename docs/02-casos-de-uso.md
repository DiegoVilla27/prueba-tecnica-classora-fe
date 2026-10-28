# 02 · Casos de uso (Frontend)

Actor único: **Cajero** (el único tipo de usuario; sin roles). Precondición general de CU-01…CU-06: sesión iniciada y venta `OPEN` cargada desde el servidor.
Cada CU indica qué piezas del código lo implementan y qué tests lo cubren.

---

## CU-00 · Iniciar sesión  *(RF-15, RF-17)*

**Flujo principal**
1. El cajero abre la app sin sesión → `/login` (guard público/privado).
2. Introduce email y contraseña (RHF + Zod) y pulsa **Entrar** (o `Enter`).
3. `POST /auth/login` → tokens en storage → `GET /users/me` → `/`.
4. La caja carga la venta (CU-08) y pone el foco en el input de código.

**Alternativos**
| Caso | Respuesta |
|---|---|
| A1 · Campos vacíos / email inválido | Errores bajo cada campo (`aria-describedby`), foco en el primero con error |
| A2 · 401 | "Email o contraseña incorrectos" (`role="alert"`); se limpia la contraseña |
| A3 · 429 | "Demasiados intentos, espera un minuto" |
| A4 · Red / arranque en frío | "Conectando con el servidor…" y reintento |
| A5 · Llega con `?expired=1` | Aviso "Tu sesión ha caducado. Vuelve a entrar." |

**Implementación:** `auth/screen` (+ `hooks/` useLoginScreen, `schema/`) · `auth/services` · `core/router` (guards) · `shared/utils/storage`.
**Tests:** unit (schema, hook), integración MSW (200, 401), E2E (login en ambos proyectos).

---

## CU-08 · Cargar o recuperar la venta  *(RF-18, RF-19)*

**Flujo:** al entrar en `/` → `GET /sales/current` → 200: se pinta la venta abierta (con sus líneas) · 404: `POST /sales` y venta vacía.
**Alternativos:** arranque en frío o red caída → `server-status` "Conectando con el servidor…" con reintentos; input deshabilitado hasta tener venta.
**Implementación:** `checkout/hooks/use-current-sale` · `screen/components/server-status`.

---

## CU-07 · Cerrar sesión  *(RF-16)*

**Disparador:** botón **Cerrar sesión** en la cabecera (junto al nombre del cajero).
**Flujo:** si hay productos en la venta → confirmación "La venta quedará abierta y podrás recuperarla al volver" → limpiar tokens y caché → `/login`.
**Implementación:** `checkout/screen/components/checkout-header` · `auth/hooks/use-logout`.

---

## CU-01 · Escanear / introducir producto  *(RF-01, RF-02, RF-06, RF-10, RF-12)*

**Disparador:** el cajero escanea (el escáner "teclea" el código + `Enter`) o escribe un código y pulsa `Enter` / botón **Añadir**.

**Flujo principal**
1. El sistema normaliza el código (trim) y valida el formato (RN-08).
2. Busca el producto por código (`GET /products/{code}`; caché si ya se consultó).
3. Si el producto **no está** en la venta → crea línea con cantidad 1 y precio congelado.
   Si **ya está** → cantidad +1 (RN-01).
4. Resalta la línea afectada, hace scroll hasta ella y anuncia por `aria-live`: "Leche entera añadida. Cantidad 2".
5. Limpia el input y mantiene el foco en él.
6. Recalcula importe y total.

**Flujos alternativos**
| Caso | Respuesta del sistema |
|---|---|
| A1 · Input vacío | No hace nada (sin error, evita ruido por `Enter` accidental) |
| A2 · Formato inválido (letras, < 4 dígitos) | Mensaje inline "Código no válido" bajo el input; texto seleccionado para reescribir; **no** se llama a la API |
| A3 · Código inexistente (404) | Mensaje inline en rojo "No existe ningún producto con el código **1234**"; texto seleccionado; sonido/flash opcional |
| A4 · Error de red / 5xx | Mensaje distinto: "No se pudo consultar el producto. Reintenta." + botón Reintentar. **No** se confunde con A3 |
| A5 · Multiplicador `N*código` | Añade N unidades (1 ≤ N ≤ 999). `0*` o `N>999` → "Cantidad no válida" |
| A6 · Superar 999 unidades al sumar | Se queda en 999 y avisa "Cantidad máxima alcanzada" |
| A7 · Escaneo mientras hay petición en curso | Se encolan y se procesan en orden (no se pierden escaneos rápidos) |

**Postcondición:** la venta refleja el producto; el input vacío y con foco.

**Implementación:** `screen/components/scan-form` (+ `hooks/` useScanForm con RHF y `schema/` Zod) · `catalog/hooks/use-product-lookup` · `use-sale-mutations` (`addLine` optimista → `POST /sales/{id}/lines`) · `models/sale` (`addProductToSale`).
**Tests:** unit (`addProductToSale`, `parseScanInput`, store `addProduct`, `scan-form`), integración MSW (200, 404, 500), E2E flujo principal.

---

## CU-02 · Modificar cantidad  *(RF-03)*

**Disparador:** botones **−** / **+** de la línea, edición directa del número, o atajos `+` / `-` sobre la línea seleccionada.

**Flujo principal**
1. El cajero cambia la cantidad.
2. El sistema valida 1–999 (RN-02) y recalcula importe y total.
3. El foco vuelve al input de código (salvo que esté editando el número).

**Alternativos**
| Caso | Respuesta |
|---|---|
| B1 · Pulsar − con cantidad 1 | Pregunta inline "¿Eliminar línea?" (Sí / No). Nunca se llega a 0 |
| B2 · Escribir 0, vacío o no numérico | Al salir del campo / `Enter` se restaura el valor anterior y aviso "Cantidad entre 1 y 999" |
| B3 · Escribir > 999 | Se limita a 999 con aviso |

**Implementación:** `shared/components/ui/molecules/quantity-stepper` · `useSaleStore.changeQuantity` · `models/quantity` (+ `QuantitySchema` Zod).
**Tests:** unit (stepper, `changeLineQuantity`, store), integración (editar y comprobar total).

---

## CU-03 · Eliminar línea  *(RF-04, RF-11)*

**Disparador:** icono 🗑 en la línea o `Supr` sobre la línea seleccionada.

**Flujo principal**
1. Se elimina la línea y se recalcula el total.
2. Toast "Leche entera eliminada · **Deshacer**" durante 5 s (`Ctrl+Z` también deshace).
3. Foco al input de código.

**Alternativo:** C1 · Deshacer → la línea vuelve **en su posición** con su cantidad y precio originales.

**¿Por qué deshacer y no un modal de confirmación?** Eliminar es frecuente; un modal en cada borrado frena al cajero. Deshacer previene el error sin añadir fricción (patrón recomendado por NN/g para acciones frecuentes y reversibles).

**Implementación:** `useSaleStore.removeLine` / `undoRemove` · toast con acción de `sonner`.
**Tests:** unit (`removeLine`/`restoreLine`, store), E2E (eliminar + deshacer).

---

## CU-04 · Finalizar venta  *(RF-09, RN-06, RN-07)*

**Disparador:** botón **Finalizar venta (F12)**.

**Precondición:** la venta tiene ≥ 1 línea (si no, el botón está **deshabilitado** con tooltip "Añade productos para finalizar").

**Flujo principal**
1. Se abre un modal con el resumen: nº de artículos, nº de líneas y **total**.
2. Foco en **Confirmar**. `Enter` confirma, `Esc` cancela.
3. Al confirmar: `PATCH /sales/{id}/complete` (no optimista; botón con estado de carga).
4. Pantalla de éxito breve "Venta finalizada · 47,85 €" → `POST /sales` → venta nueva vacía con foco en el input.

**Alternativos:** D1 · Cancelar → vuelve a la venta sin cambios. D2 · Error del backend → se mantiene la venta y se muestra el error con reintento; **nunca** se pierde la venta.

**Implementación:** `screen/components/finalize-sale-modal` · `shared/components/ui/organisms/modal` · `use-sale-mutations` (`complete`) · `useSaleStore.setSale`.
**Tests:** unit (`completeSale`, store, botón deshabilitado), integración, E2E (flujo completo).

---

## CU-05 · Vaciar venta  *(RF-13)*

**Disparador:** botón secundario **Vaciar venta** (o `Ctrl+Supr`).
**Flujo:** modal de confirmación destructivo ("Se eliminarán 7 productos") → confirmar → `PATCH /sales/{id}/cancel` → `POST /sales` → venta vacía. No hay deshacer, por eso sí usa confirmación.

---

## CU-06 · Navegar la venta con teclado  *(RNF-03)*

| Tecla | Acción |
|---|---|
| `Enter` (en input) | Añadir producto |
| `↑` / `↓` | Seleccionar línea anterior / siguiente |
| `+` / `-` | Cantidad +1 / −1 de la línea seleccionada |
| `Supr` | Eliminar línea seleccionada |
| `Ctrl+Z` | Deshacer última eliminación |
| `F12` | Finalizar venta |
| `Esc` | Cerrar modal / deseleccionar línea y volver al input |

**Implementación:** `screen/hooks` (useCheckoutScreen) sobre `shared/hooks/use-hotkeys`.

---

## Matriz de trazabilidad

| CU | RF | Unit | Integración (MSW) | E2E |
|---|---|---|---|---|
| CU-01 | 01, 02, 06, 10, 12 | ✅ | ✅ 200/404/500 | ✅ |
| CU-02 | 03 | ✅ | ✅ | ➖ (cubierto en flujo completo) |
| CU-03 | 04, 11 | ✅ | ✅ | ✅ |
| CU-04 | 09 | ✅ | ✅ | ✅ |
| CU-05 | 13 | ✅ | ➖ | ➖ |
| CU-06 | RNF-03 | ✅ | ➖ | ✅ (E2E solo teclado) |
| CU-00 | 15, 17 | ✅ | ✅ 200/401 | ✅ |
| CU-07 | 16 | ✅ | ➖ | ✅ (full-stack) |
| CU-08 | 18, 19 | ✅ | ✅ current 200/404 | ✅ (full-stack: recargar recupera la venta) |
