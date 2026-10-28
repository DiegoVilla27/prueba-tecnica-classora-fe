# 01 · Negocio y requisitos (Frontend)

## 1. Contexto de negocio

**Cliente:** Classora Technologies (prueba técnica UX/UI + Front).
**Producto:** aplicación para los **puestos de caja (TPV)** de un supermercado.
**Usuario principal:** el **cajero**. Usa la herramienta durante toda su jornada, cientos de ventas al día, muchas veces con cola delante, con un escáner de código de barras y un teclado (a veces pantalla táctil).

### ¿Por qué importa esto para el diseño?
| Realidad del cajero | Consecuencia en el producto |
|---|---|
| Escanea decenas de productos por venta | El campo de código debe tener **siempre el foco**; escanear = escribir + `Enter` |
| Tiene cola y prisa | Cero clics innecesarios, **atajos de teclado**, feedback instantáneo |
| Mira la pantalla de reojo | Tipografía grande, contraste alto, **total gigante**, último producto resaltado |
| Un error cuesta dinero o una discusión con el cliente | **Prevención de errores**: confirmaciones en acciones destructivas, deshacer, validaciones |
| Repite el mismo gesto miles de veces | Consistencia absoluta: misma posición, mismos atajos, mismas respuestas |

### Objetivo de la prueba (qué evalúan)
1. Criterio UX/UI: interfaz **coherente, usable y bien resuelta** (no estética elaborada).
2. Organización del código, **reutilización de componentes**, **fidelidad al Figma**.
3. Capacidad de explicar la integración con un backend Java (ver repo `prueba-tecnica-classora-be`).
4. Uso crítico de la IA.

---

## 2. Alcance

### Dentro del alcance (entrega completa y desplegada)
- **Login de cajero** (JWT contra la API Java) y cierre de sesión.
- **Caja / venta en curso** conectada al backend: el servidor es la fuente de verdad de precios y totales; la UI responde al instante con actualizaciones optimistas.
- Recuperar la venta abierta tras recargar la página o volver a iniciar sesión.
- Catálogo de productos ficticio (código, nombre, precio) servido por el backend (el mismo catálogo existe en los mocks MSW para tests).
- Entornos `local`, `docker`, `dev` y `prod` (Vercel), con CI.
- Tests unitarios, de integración (MSW) y E2E (Playwright, contra mocks y contra el back real).

### Fuera del alcance (YAGNI → `07-roadmap.md` "Futuro")
Cobro y medios de pago, impresión de ticket, impuestos desglosados, descuentos/promociones, gestión de usuarios y catálogo, multi-caja, modo offline, devoluciones, i18n.

---

## 3. Requisitos funcionales (RF)

| ID | Requisito | Origen | Prioridad |
|---|---|---|---|
| RF-01 | Introducir o escanear un **código** de producto y añadirlo a la venta | PDF | Must |
| RF-02 | Si el producto ya está en la venta, **incrementar su cantidad** (no duplicar línea) | PDF | Must |
| RF-03 | **Modificar la cantidad** de una línea (−/+ y edición directa) | PDF | Must |
| RF-04 | **Eliminar** una línea | PDF | Must |
| RF-05 | **Calcular automáticamente** importe por línea y **total** | PDF | Must |
| RF-06 | Mostrar **mensaje adecuado** ante código inexistente | PDF | Must |
| RF-07 | Mostrar por línea: **nombre, cantidad, precio unitario, importe** | PDF (UX) | Must |
| RF-08 | **Total claramente destacado** | PDF (UX) | Must |
| RF-09 | **Finalizar la venta** (con confirmación y resumen) | PDF (UX) | Must |
| RF-10 | Resaltar el **último producto añadido** y hacer scroll hasta él | Criterio UX | Should |
| RF-11 | **Deshacer** la eliminación de una línea (toast 5 s) | Prevención de errores | Should |
| RF-12 | **Multiplicador** `N*código` (p. ej. `6*8410001`) | Práctica real TPV | Could |
| RF-13 | **Vaciar / cancelar** venta con confirmación | Criterio UX | Could |
| RF-14 | Contador de **nº de artículos** junto al total | Criterio UX | Should |
| RF-15 | **Iniciar sesión** con email y contraseña | Realismo (TPV) | Must |
| RF-16 | Mostrar el **cajero** conectado y **cerrar sesión** | Realismo (TPV) | Must |
| RF-17 | **Renovar la sesión** sin interrumpir al cajero; si caduca, volver al login con aviso | Realismo | Must |
| RF-18 | **Recuperar la venta abierta** al recargar o volver a entrar | Prevención de errores | Must |
| RF-19 | Indicar **"Conectando con el servidor…"** durante el arranque en frío del back | Resiliencia | Should |

## 4. Requisitos no funcionales (RNF)

| ID | Requisito | Cómo se cumple / se mide |
|---|---|---|
| RNF-01 Rapidez | Añadir un producto en < 100 ms percibidos tras `Enter` (catálogo cacheado) | TanStack Query cachea por código; UI optimista |
| RNF-02 Foco | El input de código **nunca pierde el foco** salvo con un modal abierto | `setFocus('code')` de RHF tras cada acción; test de integración lo verifica |
| RNF-03 Teclado | Toda la pantalla operable sin ratón | Atajos (ver `03-ux-ui.md`); E2E solo con teclado |
| RNF-04 Legibilidad | Texto base ≥ 18 px, total ≥ 48 px, contraste AA (≥ 4.5:1) | Tokens de Figma; revisión con axe |
| RNF-05 Prevención de errores | Confirmación en finalizar y vaciar; deshacer en eliminar; cantidad 1–999; botón finalizar deshabilitado con venta vacía | Tests unitarios de `models/sale` y del store |
| RNF-06 Precisión monetaria | Sin errores de coma flotante | Dinero en **céntimos enteros**; mapper convierte |
| RNF-07 Accesibilidad | WCAG 2.1 AA: roles, `aria-live`, foco visible, área táctil ≥ 44 px | `jsx-a11y`, `@axe-core/playwright` en E2E |
| RNF-08 Resiliencia | Error de red ≠ "código inexistente": mensajes distintos y reintento | Test de integración con MSW (500 / network error) |
| RNF-09 Responsive | Óptimo en 1366×768 y 1920×1080 (pantallas de caja); usable en tablet 1024 | Breakpoints en tokens |
| RNF-10 Mantenibilidad | Arquitectura por features, reglas de `CLAUDE.md`, lint en pre-commit | oxlint + Prettier + Husky |
| RNF-11 Calidad | Unit + integración + E2E en verde antes de entregar | `pnpm test:all` |

## 5. Reglas de negocio (las aplica `features/checkout/models`)

| ID | Regla |
|---|---|
| RN-01 | Un producto aparece **una sola vez** por venta; reescanearlo suma cantidad |
| RN-02 | Cantidad mínima 1, máxima 999 por línea. Bajar de 1 ⇒ se pregunta si eliminar |
| RN-03 | Importe de línea = precio unitario × cantidad (en céntimos) |
| RN-04 | Total = Σ importes de línea |
| RN-05 | El **precio se congela** al añadir el producto (snapshot): si el catálogo cambia, la línea no |
| RN-06 | No se puede finalizar una venta **vacía** |
| RN-07 | Una venta finalizada es **inmutable**; tras finalizar empieza una nueva vacía |
| RN-08 | Código válido: solo dígitos, longitud 4–14 (cubre códigos internos y EAN-8/13/GTIN-14). Se recortan espacios |

## 6. Glosario (lenguaje ubicuo, compartido con el backend)

| Término | Significado |
|---|---|
| **Venta (Sale)** | Conjunto de líneas que se cobran juntas. Estados: `OPEN`, `COMPLETED`, `CANCELLED` |
| **Línea (SaleLine)** | Producto + cantidad + precio congelado + importe |
| **Producto (Product)** | Elemento del catálogo: código, nombre, precio |
| **Código (ProductCode)** | Identificador escaneable del producto |
| **Escanear** | Introducir un código (escáner o teclado) y confirmar con `Enter` |
| **Finalizar** | Cerrar la venta: pasa a `COMPLETED` |
| **Importe** | Precio unitario × cantidad |
| **Total** | Suma de importes |
