# 03 · Diseño UX/UI (Figma) y su traducción a código

> Parte 1 de la prueba. Entregable: **enlace a Figma**. El código debe ser **fiel** a ese diseño, por eso los tokens de Figma se replican 1:1 en el bloque `@theme` de `src/index.css` (Tailwind v4).

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
│ HEADER  Caja 03 · Cajero: Ana · 28/10/2026 14:32               │                          │
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

## 3. Frames a entregar en Figma

1. **Venta vacía**: estado vacío con ilustración mínima + "Escanea un producto para empezar". Finalizar deshabilitado.
2. **Venta con productos**: 5–8 líneas, una resaltada como "último añadido", una seleccionada por teclado.
3. **Error código inexistente**: mensaje inline + input en estado error.
4. **Error de red**: mensaje distinto + botón Reintentar.
5. **Cantidad en 1 → "¿Eliminar línea?"**: confirmación inline.
6. **Toast deshacer** tras eliminar.
7. **Modal finalizar venta**: resumen + Confirmar/Cancelar.
8. **Venta finalizada**: feedback de éxito.
9. **Modal vaciar venta** (destructivo).
10. **Página de componentes** con todas las variantes (ver §5).
11. (Opcional) **Prototipo** clicable del flujo principal.

## 4. Design tokens (Figma Variables → `@theme` de Tailwind v4)

Mismos nombres en Figma y en `src/index.css`. En código se usan **solo** vía clases (`bg-primary`, `text-total`), nunca valores arbitrarios ni `var()` en `className`.

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;

  --color-surface: #ffffff;        /* tarjetas, tabla */
  --color-canvas: #f6f7f9;         /* fondo app */
  --color-ink: #111827;            /* texto principal */
  --color-ink-muted: #4b5563;      /* secundario, ≥ 4.5:1 sobre surface */
  --color-primary: #15803d;        /* finalizar / éxito (blanco encima ≥ 4.5:1) */
  --color-danger: #b91c1c;         /* eliminar / error */
  --color-warning: #92400e;        /* avisos */
  --color-focus: #2563eb;          /* anillo de foco */
  --color-highlight: #fef9c3;      /* último añadido */

  --text-base: 1.125rem;           /* 18px tabla */
  --text-scan: 1.375rem;           /* 22px input de código */
  --text-total: 3.5rem;            /* 56px total */

  --spacing-target: 2.75rem;       /* 44px objetivo táctil mínimo → min-h-target min-w-target */
}
```
- Espaciados, radios y sombras: escala por defecto de Tailwind (equivale al Auto Layout 4/8/12/16/24/32 de Figma).
- Importes: `tabular-nums text-right`.
- Foco: `focus-visible:ring-4 focus-visible:ring-focus` en todos los interactivos.
- Animaciones con `motion-safe:` para respetar `prefers-reduced-motion`.

## 5. Biblioteca de componentes (Figma ⇄ código)

| Figma | Código | Variantes |
|---|---|---|
| Button | `shared/components/ui/button` | `primary` · `secondary` · `danger` · `ghost`; `md` · `lg`; `isLoading`; slot de atajo (`Kbd`) |
| IconButton | `shared/components/ui/icon-button` | `danger` (papelera), `neutral`; `aria-label` obligatorio |
| Input | `shared/components/ui/input` | `default` · `error` · `disabled`; `label`, `error`, `helperText` (patrón task-manager) |
| QuantityStepper | `shared/components/ui/quantity-stepper` | normal · en mínimo · en máximo |
| Money | `shared/components/ui/money` | `md` · `lg` · `xl` (total) |
| Alert (inline) | `shared/components/ui/alert` | `error` · `warning` · `info` |
| Toast | `sonner` (`<Toaster />` en `core/providers`) | con acción (Deshacer) |
| Modal | `shared/components/ui/modal` | `default` · `destructive` |
| Kbd | `shared/components/ui/kbd` | etiqueta de atajo |
| EmptyState | `shared/components/ui/empty-state` | — |
| ScanForm | `checkout/screen/components/scan-form` | idle · loading · error · error de red |
| SaleTable | `checkout/screen/components/sale-table` | vacía · con datos |
| SaleLineRow | `checkout/screen/components/sale-line-row` | normal · seleccionada · recién añadida |
| TotalPanel | `checkout/screen/components/total-panel` | vacío · con total |
| FinalizeSaleModal | `checkout/screen/components/finalize-sale-modal` | — |
| ClearSaleModal | `checkout/screen/components/clear-sale-modal` | destructivo |
| SaleCompleted | `checkout/screen/components/sale-completed` | — |
| ShortcutsBar | `checkout/screen/components/shortcuts-bar` | — |

> **Fidelidad:** mismos nombres (PascalCase en Figma, kebab-case en carpetas), mismas variantes y mismos tokens. En la entrega se adjuntan capturas Figma vs app lado a lado.

## 6. Microcopy

| Situación | Texto |
|---|---|
| Placeholder input | "Escanea o introduce un código" |
| Código inexistente | "No existe ningún producto con el código {code}" |
| Formato inválido | "Código no válido: solo números (4–14 dígitos)" |
| Error de red | "No se pudo consultar el producto. Revisa la conexión y reintenta." |
| Máximo alcanzado | "Cantidad máxima por producto: 999" |
| Eliminado | "{name} eliminado" · acción "Deshacer" |
| Finalizar (modal) | "¿Finalizar venta?" · "{n} artículos · Total {total}" · "Confirmar (Enter)" / "Cancelar (Esc)" |
| Venta vacía | "Escanea un producto para empezar" |
| Éxito | "Venta finalizada · {total}" |

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
