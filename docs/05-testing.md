# 05 · Estrategia de testing (Frontend)

Mismo enfoque que task-manager-client: Vitest con **dos proyectos** (`unit` e `integration`), RTL, MSW, patrón **AAA** y cobertura ≥ 80 %. E2E con **Playwright** (en lugar de Cypress).

## 1. Pirámide

```
            ▲   E2E (Playwright + axe)    4 specs · flujos críticos
           ▲▲▲  Integración (RTL + MSW)    la screen completa con red simulada
        ▲▲▲▲▲▲▲ Unit (Vitest + RTL)        happy path de cada pieza
```

| Nivel | Objetivo | Qué NO hace |
|---|---|---|
| **Unit** | Cada pieza hace su trabajo en el caso normal | No toca red real; no prueba combinaciones de pantalla |
| **Integración** | Las piezas encajan con services reales y red simulada (MSW), éxito y errores | No usa navegador real |
| **E2E** | Los **flujos críticos** funcionan en navegador real y son accesibles | No re-testea bordes ya cubiertos abajo |

## 2. Convenciones (de task-manager)

```tsx
/**
 * @fileoverview Unit tests for the `ScanForm` component.
 * Verifies the code field is rendered, labelled and submits the typed code.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScanForm from '.';

describe('Checkout: ScanForm', () => {
  it('should add the scanned product when a valid code is submitted', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ScanForm />);

    // Act
    await user.type(screen.getByLabelText(/código/i), '8410001000011{Enter}');

    // Assert
    expect(screen.getByLabelText(/código/i)).toHaveValue('');
  });
});
```
- `describe('<Capa>: <nombre>')` · `it('should …')` · comentarios `// Arrange / // Act / // Assert`.
- `@fileoverview` en cada archivo.
- `globals: true` (sin importar `describe/it/expect`).
- Queries por rol/label; `user-event`; nada de `fireEvent`.

## 3. Unit tests — happy path (`index.test.ts(x)` junto a cada archivo)

| Pieza | Casos |
|---|---|
| `models/money` | suma y multiplicación en céntimos |
| `models/quantity` | `clampQuantity` dentro de rango |
| `models/sale` | `addProductToSale` (nuevo y repetido suma), `changeLineQuantity`, `removeLine` + `restoreLine`, `completeSale`, `saleTotal`, `itemCount` |
| `checkout/store` | cada acción actualiza el estado (`useSaleStore.getState().addProduct(...)`); selectores `selectTotal`, `selectItemCount` |
| `scan-form/schema` | acepta `"8410001000011"` y `"6*8410001000011"` |
| `catalog/services/mappers` | DTO `0.95` → `95` céntimos |
| `catalog/services` | `getProductByCodeSvc` devuelve `Product` (MSW por defecto) |
| `shared/utils/format-money` · `cn` | `4785` → `"47,85 €"` · merge de clases |
| `shared/components/ui/*` | renderiza, dispara `onClick`/`onChange`, nombre accesible |
| `screen/components/*` | pintan datos y emiten acciones |
| hooks (`hooks/index.ts`) | `renderHook` del caso normal; sus services se pueden mockear con `vi.mock` |

> Unit = **happy path**. Los errores de red se cubren en integración. Los bordes de negocio puros y críticos (máximo 999, venta vacía no finaliza) se añaden en `models/sale` porque son baratos.

**Store en tests:**
```ts
beforeEach(() => useSaleStore.setState(initialSaleState));
```

## 4. Integración con MSW (`screen/index.integration.test.tsx`, proyecto `integration`)

Se renderiza `CheckoutScreen` dentro de `AppProviders` (QueryClient con `retry: false` + Toaster) con el **store real**. La red la responde MSW (`shared/mocks/server` con los handlers de `features/*/mocks/handlers`).

| # | Escenario | Handler | Esperado |
|---|---|---|---|
| I-01 | Escanear código existente | 200 | Fila con nombre, cantidad 1, precio, importe; total actualizado; input vacío **y con foco** |
| I-02 | Escanear dos veces el mismo | 200 | Una fila con cantidad 2; **una** sola petición (caché TanStack Query) |
| I-03 | Código inexistente | 404 | `role="alert"` "No existe ningún producto con el código…"; venta intacta |
| I-04 | Error de servidor | 500 (`server.use`) | Mensaje de error de red; distinto de I-03 |
| I-05 | Red caída | `HttpResponse.error()` | Igual que I-04 |
| I-06 | Modificar cantidad y eliminar + deshacer | 200 | Total recalculado; la línea vuelve |
| I-07 | Finalizar venta | 200 | Modal → confirmar → éxito → venta vacía |
| I-08 | Multiplicador `3*código` | 200 | Cantidad 3 |
| I-09 | Anuncios | 200 | La región `aria-live` contiene "Leche entera 1L añadido" |

## 5. E2E con Playwright (`e2e/`) — solo flujos importantes

La app se levanta con `pnpm local` y `VITE_USE_MOCKS=true` (MSW worker) → E2E deterministas sin backend. Un proyecto opcional `with-backend` apunta a la API Java.

| Spec | Flujo |
|---|---|
| `checkout-happy-path` | Escanear 3 productos (uno repetido) → total → F12 → confirmar → venta nueva vacía |
| `checkout-unknown-code` | Código inexistente → mensaje → corregir → producto añadido |
| `checkout-remove-undo` | Añadir → eliminar → Deshacer → la línea vuelve con su cantidad |
| `checkout-keyboard-a11y` | Todo el flujo **sin ratón** (↑↓, +/−, Supr, F12, Enter/Esc) + `AxeBuilder` sin violaciones `serious`/`critical` en cada estado |

`playwright.config.ts`: Chromium (+ WebKit opcional), `webServer` con `pnpm local`, viewport 1366×768, `trace: 'on-first-retry'`.

## 6. Configuración

`vite.config.ts` (igual que task-manager): `test.projects` → `unit` (`**/*.test.{ts,tsx}` excluyendo `*.integration.*`) e `integration` (`**/*.integration.test.{ts,tsx}`), `environment: 'jsdom'`, `setupFiles: './src/setupTests.ts'`, cobertura v8 con `thresholds` 80 % (excluye `main.tsx`, mocks, `*.integration.*`, `environments`).

`src/setupTests.ts`: `jest-dom/vitest`; `server.listen({ onUnhandledRequest: 'error' })`; `cleanup()` + `server.resetHandlers()` tras cada test; `server.close()` al final.

```jsonc
"test":             "vitest run",
"test:watch":       "vitest",
"test:unit":        "vitest run --project unit --coverage",
"test:integration": "vitest run --project integration",
"test:coverage":    "vitest run --coverage",
"e2e":              "playwright test",
"e2e:ui":           "playwright test --ui"
```

## 7. Criterios de "hecho"
- [ ] Unit happy path de toda pieza nueva.
- [ ] Integración actualizada si cambia el comportamiento de la screen.
- [ ] E2E en verde si se tocó un flujo crítico; axe sin violaciones graves.
- [ ] Sin warnings de `act()` ni peticiones no manejadas.
