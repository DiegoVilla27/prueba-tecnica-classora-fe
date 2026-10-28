# 03 · Diseño UX/UI (Figma) y su traducción a código

> Parte 1 de la prueba. Entregable: **enlace a Figma** ([Classora TPV · Login y caja](https://www.figma.com/design/hbVVhN8sPqR56dLazj9IEy/Classora-TPV-%C2%B7-Login-y-caja)) y sus capturas en [`docs/figma/`](figma/). El código debe ser **fiel** a ese diseño: los tokens de §4 se han medido sobre esas capturas y viven en el bloque `@theme` de `src/index.css` (Tailwind v4).

## 1. Principios de diseño (y por qué)

| Principio | Decisión concreta | Por qué |
|---|---|---|
| **Rapidez** | Input de código arriba, siempre con foco; atajos visibles (`F12`) en los botones | El 90 % de la interacción es escanear |
| **Legibilidad** | Texto ≥ 18 px, total ≥ 48 px en negrita, números con `tabular-nums` y alineados a la derecha | Lectura de reojo; columnas de importes alineadas se comparan sin esfuerzo |
| **Prevención de errores** | Deshacer en eliminar, confirmación en finalizar/vaciar, cantidades acotadas, finalizar deshabilitado si vacío, errores distinguibles (no existe ≠ sin red) | Errores en caja = dinero |
| **Feedback inmediato** | Última línea resaltada 1,5 s + scroll; anuncio `aria-live`; error inline junto al input | El cajero tiene que saber qué pasó sin buscar |
| **Consistencia** | Misma posición para acciones primarias; un solo color por intención | Memoria muscular |
| **Jerarquía clara** | Total > Finalizar > lista > acciones secundarias | Lo que más importa, más grande |

## 2. Layout (1366×768 y 1920×1080, horizontal)

```
┌───────────────────────────────────────────────────────────────┬──────────────────────────┐
│ HEADER  Caja · Cajero: Ana López · 14:32      [Cerrar sesión]   │                          │
├───────────────────────────────────────────────────────────────┤        TOTAL             │
│ [🔍  Escanea o introduce un código…                ] [Añadir ⏎]│      47,85 €             │
│  ⚠ No existe ningún producto con el código 1234                │   12 artículos · 5 líneas│
├───────────────────────────────────────────────────────────────┤                          │
│ PRODUCTO              CANTIDAD        P. UNIT.     IMPORTE      │                          │
│ Leche entera 1L       [−] 2 [+]         0,95 €      1,90 €  🗑  │                          │
│ Pan de barra          [−] 1 [+]         0,60 €      0,60 €  🗑  │  [ Vaciar venta ]        │
│ ▶ Aceite oliva 1L     [−] 1 [+]         8,99 €      8,99 €  🗑  │                          │
│   (último añadido, resaltado)                                   │  [ FINALIZAR VENTA  F12 ]│
├───────────────────────────────────────────────────────────────┤                          │
│ ↑↓ seleccionar · +/- cantidad · Supr eliminar · Ctrl+Z deshacer │                          │
└───────────────────────────────────────────────────────────────┴──────────────────────────┘
          zona de trabajo (≈ 70 %)                                  panel de cobro (≈ 30 %)
```

- Panel derecho **fijo**: el total nunca se desplaza con el scroll de la lista.
- La lista hace scroll interno; cabecera de tabla *sticky*.
- Barra inferior con chuleta de atajos (enseña sin documentación).
- Tablet (≤ 1024): el panel de total pasa a barra inferior fija.

## 3. Frames de Figma

Capturas exportadas en [`docs/figma/`](figma/) (1366×768). ✅ = diseñado en Figma · 🧩 = sin frame propio: se construye en código con los mismos tokens y componentes, siguiendo el patrón del frame más cercano.

| # | Frame | Estado | Captura |
|---|---|---|---|
| 0 | **Login**: panel de marca + email, contraseña (Mostrar), Entrar en la caja | ✅ | `01 · Login/LoginScreen/Todos los estados.jpg` |
| 0b | Login: credenciales incorrectas · sesión caducada · cargando | 🧩 `Alert` + `Button isLoading` | — |
| 1 | **Venta vacía** (Finalizar deshabilitado) | 🧩 `EmptyState` en la tabla | — |
| 2 | **Venta con productos**, último añadido resaltado | ✅ | `02 · Caja/01 · Con productos.jpg` |
| 3 | **Código inexistente** | ✅ | `02 · Caja/04 · Código inexistente.jpg` |
| 3b | **Código no válido** | ✅ | `02 · Caja/05 · Código no válido.jpg` |
| 4 | Error de red + Reintentar | 🧩 mismo patrón que 3 | — |
| 5 | **Cantidad máxima (999)**: + deshabilitado y error | ✅ | `02 · Caja/08 · Cantidad máxima.jpg` |
| 6 | **Producto eliminado · Deshacer** (toast) | ✅ | `02 · Caja/11 · Producto eliminado/deshacer.jpg` |
| 7 | **Modal finalizar venta** (finalizando…) | ✅ | `02 · Caja/13 · Finalizando venta.jpg` |
| 8 | Venta finalizada | 🧩 `EmptyState` + `Money` | — |
| 9 | **Modal vaciar venta** (destructivo) | ✅ | `02 · Caja/16 · Confirmar vaciar venta.jpg` |
| 9b | Conectando con el servidor (arranque en frío de Render) | 🧩 `Spinner` + input deshabilitado | — |
| 9c | **Cerrar sesión** con venta abierta | ✅ | `02 · Caja/17 · Confirmar cerrar sesión.jpg` |
| 10 | Página de componentes | 🧩 inventario en §5 | — |

> Los códigos que aparecen en las capturas (`1001`, `1002`…) son de ejemplo: el catálogo real son 20 productos con EAN-13 (`84123450000xx`), ver el back.

## 4. Design tokens y tipografía

El archivo de Figma no define variables, así que los tokens los fija el código. Se han **medido sobre las capturas** de `docs/figma/` (color exacto de píxel) y se han **corregido solo donde no cumplían WCAG AA**. Nombres **semánticos** (por intención, no por color): si mañana cambia la marca, cambia el valor, no las clases.

En código se usan **solo** vía clases (`bg-primary`, `text-ink-muted`, `text-total`), nunca valores arbitrarios ni `var()` en `className`.

### 4.1 Color

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `canvas` | `#f3f5f4` | Fondo de la app | — |
| `surface` | `#ffffff` | Tarjetas, tabla, modales, cabecera | — |
| `surface-muted` | `#f3f5f4` | Cabecera de la tabla | — |
| `border` | `#dbe4df` | Bordes decorativos de tarjetas y separadores | — (decorativo) |
| `border-strong` | `#758981` | Borde de inputs y botones secundarios | 3,7:1 sobre `surface` (≥ 3:1 de WCAG 1.4.11) · *ajustado: en Figma `#dbe4df` = 1,3:1* |
| `ink` | `#172a24` | Texto principal, total | 15,1:1 |
| `ink-muted` | `#52675e` | Texto secundario (ayudas, subtítulos) | 6,1:1 sobre `surface` · 5,5:1 sobre `canvas` |
| `ink-subtle` | `#5f716a` | Texto terciario (barra de atajos, "Importes en euros") | 4,7:1 sobre `canvas` · *ajustado: en Figma `#798a84` = 3,3:1* |
| `primary` | `#186342` | Acción principal, panel de marca, logo | blanco encima 7,2:1 |
| `primary-hover` | `#124d33` | Hover/pressed de `primary` | blanco encima 9,8:1 |
| `primary-subtle` | `#eaf5ed` | Fila "último añadido", fondo del avatar | `ink` encima 13,5:1 |
| `on-primary` | `#ffffff` | Texto sobre `primary` y `danger` | — |
| `danger` | `#a62627` | Acción destructiva, texto y borde de error | 7,2:1 (texto y blanco encima) |
| `danger-hover` | `#8a1f20` | Hover/pressed de `danger` | blanco encima 9,1:1 |
| `focus` | `#245bdc` | Anillo de foco (3 px) en todos los interactivos | 5,8:1 sobre `surface` |
| `inverse` | `#172a24` | Fondo del toast (Deshacer) | blanco encima 15,1:1 |
| `overlay` | `#172a24` al 60 % | Fondo tras los modales | — |

### 4.2 Tipografía

**Inter Variable** (autoalojada con `@fontsource-variable/inter`, sin peticiones a Google): sans geométrica pensada para pantalla, cifras muy legibles y con **`tabular-nums`** (todas las cifras miden lo mismo → columnas de importes alineadas). Fallback: `system-ui, sans-serif`.

| Token | Tamaño / interlineado | Peso | Uso (frame) |
|---|---|---|---|
| `text-total` | 56 px / 1 | 700 | Total de la venta y del modal finalizar |
| `text-display` | 48 px / 1,2 | 600 | Titular del panel de marca del login |
| `text-title` | 28 px / 1,25 | 700 | "Venta en curso", "Entra en tu caja", título de modal |
| `text-scan` | 18 px / 1,5 | 400 | Input de código y campos del login |
| `text-body` | 18 px / 1,5 | 600 / 400 | Nombre del producto, importes de la tabla |
| `text-sm` (Tailwind) | 14 px | 500 / 400 | Labels, subtítulos, botón secundario |
| `text-xs` (Tailwind) | 12 px | 400 | Código bajo el producto, ayudas, barra de atajos |
| `text-overline` | 11 px / 1,4, `uppercase`, `tracking-wide` | 600 | "TOTAL DE LA VENTA", "REVISAR VENTA", cabeceras de tabla |

Importes y cantidades: siempre `tabular-nums` y alineados a la derecha.

### 4.3 Forma, espacio y movimiento

| Token | Valor | Uso |
|---|---|---|
| `radius-control` | 8 px | Inputs, botones, stepper |
| `radius-card` | 12 px | Tarjetas, tabla |
| `radius-modal` | 16 px | Modales |
| `shadow-modal` | `0 24px 48px -12px rgb(23 42 36 / 0.25)` | Modales |
| `spacing-target` | 44 px | Objetivo táctil mínimo (`min-h-target`, `min-w-target`) |
| `spacing-control` | 56 px | Altura del input de código y de los botones grandes (Añadir, Finalizar) |
| Espaciado | escala de Tailwind (4 · 8 · 12 · 16 · 24 · 32) | Igual que el Auto Layout del diseño |
| Movimiento | 150 ms `ease-out`, siempre bajo `motion-safe:` | Hover, aparición de modal y toast, resaltado de "último añadido" |

### 4.4 `@theme` resultante (`src/index.css`)

```css
@import 'tailwindcss';
@import '@fontsource-variable/inter';

@theme {
  --font-sans: 'Inter Variable', system-ui, sans-serif;

  --color-canvas: #f3f5f4;
  --color-surface: #ffffff;
  --color-surface-muted: #f3f5f4;
  --color-border: #dbe4df;
  --color-border-strong: #758981;
  --color-ink: #172a24;
  --color-ink-muted: #52675e;
  --color-ink-subtle: #5f716a;
  --color-primary: #186342;
  --color-primary-hover: #124d33;
  --color-primary-subtle: #eaf5ed;
  --color-on-primary: #ffffff;
  --color-danger: #a62627;
  --color-danger-hover: #8a1f20;
  --color-focus: #245bdc;
  --color-inverse: #172a24;
  --color-overlay: rgb(23 42 36 / 0.6);

  --text-total: 3.5rem;
  --text-total--line-height: 1;
  --text-display: 3rem;
  --text-display--line-height: 1.2;
  --text-title: 1.75rem;
  --text-title--line-height: 1.25;
  --text-scan: 1.125rem;
  --text-scan--line-height: 1.5;
  --text-body: 1.125rem;
  --text-body--line-height: 1.5;
  --text-overline: 0.6875rem;
  --text-overline--line-height: 1.4;

  --radius-control: 0.5rem;
  --radius-card: 0.75rem;
  --radius-modal: 1rem;
  --shadow-modal: 0 24px 48px -12px rgb(23 42 36 / 0.25);

  --spacing-target: 2.75rem;
  --spacing-control: 3.5rem;
}
```

## 5. Design system (Atomic Design) y componentes de pantalla

Inventario sacado de los frames. Lo **genérico y sin negocio** va a `shared/components/ui/<nivel>/` (reglas en `CLAUDE.md` §2.4); lo **específico de la caja** va a `features/checkout/screen/components/` y se construye componiendo el design system.

### 5.1 `shared/components/ui`

| Nivel | Componente | Variantes / props | Dónde aparece |
|---|---|---|---|
| atom | `Button` | `primary` · `secondary` · `danger` · `ghost`; `md` · `lg`; `isLoading` ("Finalizando…"); `shortcut` (pinta un `Kbd`) e icono final opcional | Entrar en la caja, Añadir ⏎, Finalizar venta F12, Vaciar venta, Salir, botones de modal |
| atom | `IconButton` | `neutral` · `danger`; `aria-label` obligatorio | Papelera, − / + del stepper |
| atom | `Input` | `default` · `error` · `disabled`; `size` `md` · `lg` (código) | Código de producto, email, contraseña |
| atom | `Label` | `required` opcional | "Código de producto", "Email" |
| atom | `Badge` | `neutral` | "Abierta" |
| atom | `Avatar` | iniciales | "AL" |
| atom | `Kbd` | — | F12, ⏎, Ctrl Z, Esc |
| atom | `Spinner` | `sm` · `md` | Botón cargando, conectando con el servidor |
| atom | `Money` | `md` · `lg` · `total`; recibe **céntimos** | Precios, importes, total |
| atom | `Overline` | — | "TOTAL DE LA VENTA", "REVISAR VENTA", "PUESTO DE CAJA" |
| atom | `Card` | `padding` | Bloque del código, tabla, panel del total |
| atom | `Logo` | `onPrimary` (sobre verde) | Cabecera y panel de marca |
| molecule | `FormField` | `label`, `helperText`, `error` (icono + texto, `role="alert"`, `aria-describedby`) | Código de producto, email |
| molecule | `PasswordField` | `FormField` + botón Mostrar/Ocultar | Contraseña |
| molecule | `QuantityStepper` | normal · en mínimo · en máximo (999 deshabilita +) | Columna Cantidad |
| molecule | `Alert` | `error` · `info` (inline) | Errores de red y del login |
| molecule | `KeyValue` | — | "Estado · En curso" |
| molecule | `ShortcutHint` | `Kbd` + etiqueta | "F12 Finalizar" |
| molecule | `UserBadge` | `Avatar` + nombre + subtítulo | "Ana López · Sesión de cajero" |
| molecule | `EmptyState` | icono, título, descripción | Venta vacía |
| organism | `Modal` | `default` · `destructive`; `overline`, `title`, `description`, `children`, acciones; *focus trap*, `Esc`, devuelve el foco | Finalizar, vaciar, cerrar sesión |
| organism | `AppHeader` | slots: marca, contexto ("Puesto de caja"), usuario, acciones | Cabecera de la caja |
| organism | `ShortcutsBar` | lista de `ShortcutHint` + texto final | Pie de la caja |
| organism | `DataTable` | piezas semánticas (`Table`, `Th`, `Tr`, `Td`) con cabecera `surface-muted` y fila `highlighted` | Tabla de la venta |
| template | `AuthLayout` | `aside` (panel de marca) + `children` (formulario) | Login |
| template | `AppLayout` | `header`, `main` (≈ 70 %), `aside` (≈ 30 %, fijo), `footer` | Caja |
| — | Toast | `sonner` (`<Toaster />` en `core/providers`) con estilo `inverse` y acción | "Huevos camperos eliminados · Deshacer" |

### 5.2 `features/*/screen/components` (negocio)

| Componente | Compone | Estados |
|---|---|---|
| `LoginForm` (auth) | `FormField`, `PasswordField`, `Button`, `Alert` | idle · cargando · credenciales incorrectas · sesión caducada |
| `ScanForm` | `FormField` + `Button` | idle · cargando · código inexistente · código no válido · cantidad máxima · error de red |
| `SaleTable` / `SaleLineRow` | `DataTable`, `Money`, `QuantityStepper`, `IconButton` | vacía · con datos · fila recién añadida |
| `TotalPanel` | `Card`, `Overline`, `Money`, `KeyValue`, `Button` | vacío (Finalizar deshabilitado) · con total |
| `FinalizeSaleModal` | `Modal`, `Money`, `Button` | revisar · finalizando |
| `ClearSaleModal` | `Modal` `destructive` | — |
| `LogoutModal` | `Modal` | — |
| `SaleCompleted` | `EmptyState`, `Money`, `Button` | — |

> **Fidelidad:** mismos nombres (PascalCase en Figma, kebab-case en carpetas), mismas variantes y mismos tokens. En la entrega se adjuntan capturas Figma vs app lado a lado.

## 6. Microcopy

Fuente de verdad: los frames de Figma (textos literales). Lo marcado 🧩 no tiene frame y sigue el mismo tono.

| Situación | Texto |
|---|---|
| Login: título · subtítulo | "Entra en tu caja" · "Introduce tus credenciales de cajero." |
| Login: botón · pie | "Entrar en la caja" · "Acceso exclusivo para personal de caja" |
| Login: panel de marca | "PUESTO DE CAJA" · "Todo listo. Vamos con la siguiente venta." · "Tu venta abierta te espera al volver a iniciar sesión." |
| Login: credenciales 🧩 | "Email o contraseña incorrectos." |
| Login: sesión caducada 🧩 | "Tu sesión ha caducado. Vuelve a entrar." |
| Arranque en frío 🧩 | "Conectando con el servidor…" |
| Input de código: label · placeholder · ayuda | "Código de producto" · "Escanea o escribe el código" · "Escanea un código y pulsa Enter. También puedes introducirlo manualmente." |
| Código inexistente | "No existe ningún producto con el código {code}. Revisa el código." |
| Código no válido | "Código no válido. Introduce entre 4 y 14 dígitos." |
| Cantidad máxima | "Cantidad máxima por producto: 999. No se añadieron más unidades." |
| Error de red 🧩 | "No se pudo consultar el producto. Revisa la conexión y reintenta." |
| Eliminado (toast) | "{name} eliminados" · acción "Deshacer" |
| Panel total | "TOTAL DE LA VENTA" · "{n} artículos · {m} productos" · "Estado · En curso" |
| Modal finalizar | "REVISAR VENTA" · "¿Finalizar esta venta?" · "{n} artículos · {m} productos. Comprueba el total antes de confirmar." · "Volver a la venta" / "Finalizar venta" ("Finalizando…") |
| Modal vaciar | "CANCELAR VENTA" · "¿Vaciar la venta?" · "Se eliminarán los {n} artículos de esta venta. Esta acción no se puede deshacer." · "Volver a la venta" / "Vaciar venta" |
| Modal cerrar sesión | "CERRAR SESIÓN" · "¿Quieres salir de la caja?" · "La venta quedará abierta y podrás recuperarla al volver a iniciar sesión." · "Volver a la venta" / "Cerrar sesión" |
| Venta vacía 🧩 | "Escanea un producto para empezar" |
| Venta finalizada 🧩 | "Venta finalizada · {total}" |
| Barra de atajos | "⏎ Añadir · F12 Finalizar · Ctrl Z Deshacer · Esc Cerrar diálogo" · "Importes en euros" |

## 7. Checklist de accesibilidad (WCAG 2.2 AA)
- [ ] Contraste AA en todos los textos (comprobar en Figma con plugin Stark/Able).
- [ ] Foco visible (3 px `--color-focus`) en todos los interactivos.
- [ ] `aria-live="polite"` para "producto añadido"; `role="alert"` para errores.
- [ ] Tabla semántica (`<table>`, `<th scope>`), cantidades con `aria-label="Cantidad de Leche entera"`.
- [ ] Botones de icono con `aria-label`.
- [ ] Modal con *focus trap*, `aria-modal`, cierre con `Esc`, devuelve el foco al input.
- [ ] Toda acción posible solo con teclado; orden de tabulación = orden visual.
- [ ] Errores con icono + texto (no solo color) y vinculados al input (`aria-invalid`, `aria-describedby`).
- [ ] Objetivos táctiles ≥ 44×44 px (`min-h-target`).
- [ ] Animaciones bajo `motion-safe:`.
- [ ] Zoom al 200 % sin pérdida de contenido ni scroll horizontal en 1366 px.
- [ ] `lang="es"` en `<html>` y título de documento descriptivo.
