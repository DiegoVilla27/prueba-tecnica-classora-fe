# 05 · Estrategia de testing (Frontend)

Mismo enfoque que task-manager-client: Vitest con **dos proyectos** (`unit` e `integration`), RTL, MSW, patrón **AAA** y cobertura ≥ 80 %. E2E con **Playwright** (en lugar de Cypress), contra mocks y contra el back real.

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

Se renderiza la screen dentro de `AppProviders` (QueryClient con `retry: false`, Toaster, `MemoryRouter`) con el **store real** y los **interceptores reales**. MSW responde con handlers por feature:
- `auth/mocks/handlers`: `/auth/login` (200 o 401 según credenciales), `/auth/refresh`, `/users/me`.
- `catalog/mocks/handlers`: `/products/:code` (200/404/400).
- `checkout/mocks/handlers`: `/sales*` con una **venta en memoria** (se reinicia en `afterEach`) que aplica las mismas reglas que el back.

### Login (`auth/screen/index.integration.test.tsx`)
| # | Escenario | Esperado |
|---|---|---|
| L-01 | Credenciales válidas | Tokens en storage y navegación a `/` |
| L-02 | 401 | `role="alert"` "Email o contraseña incorrectos" |
| L-03 | Campos vacíos | Errores de Zod vinculados a cada input |

### Caja (`checkout/screen/index.integration.test.tsx`)
| # | Escenario | Handler | Esperado |
|---|---|---|---|
| I-01 | Carga sin venta abierta | current 404 → POST 201 | Venta vacía, input con foco |
| I-02 | Carga con venta abierta | current 200 | Se pintan sus líneas |
| I-03 | Escanear código existente | 200 | Fila, total, input vacío y con foco |
| I-04 | Escanear dos veces el mismo | 200 | Una fila con cantidad 2; un solo `GET /products` (caché) |
| I-05 | Código inexistente | 404 | `role="alert"` inline; venta intacta |
| I-06 | Fallo al añadir línea | `POST lines` 500 (`server.use`) | Rollback: la línea optimista desaparece + mensaje |
| I-07 | Red caída | `HttpResponse.error()` | Igual que I-06 |
| I-08 | Cantidad, eliminar y deshacer | 200 | Total recalculado; la línea vuelve |
| I-09 | Finalizar | 200 | Modal → éxito → venta nueva vacía |
| I-10 | Vaciar | cancel 204 → POST 201 | Venta nueva vacía |
| I-11 | Token caducado | primer 401 → refresh 200 → reintento 200 | La acción se completa sin que el cajero lo note |
| I-12 | Anuncios | 200 | La región `aria-live` contiene "Leche entera 1L añadido" |

## 5. E2E con Playwright (`e2e/`) — solo flujos importantes

Dos proyectos en `playwright.config.ts`:
| Proyecto | App | API | Cuándo |
|---|---|---|---|
| `mocked` | `pnpm local:mock` (MSW worker) | MSW | Siempre (local y CI); determinista |
| `full-stack` | `pnpm local` | API real en Docker (PostgreSQL + imagen del back) | CI y antes de cada release (como el Cypress de task-manager) |

| Spec | Flujo | mocked | full-stack |
|---|---|---|---|
| `login` | Login correcto e incorrecto | ✅ | ✅ |
| `checkout-happy-path` | Login → escanear 3 productos (uno repetido) → total → F12 → confirmar → venta nueva | ✅ | ✅ |
| `checkout-unknown-code` | Código inexistente → mensaje → corregir → añadido | ✅ | ✅ |
| `checkout-remove-undo` | Añadir → eliminar → Deshacer | ✅ | — |
| `checkout-recover-sale` | Añadir productos → recargar → la venta sigue ahí | — | ✅ |
| `checkout-keyboard-a11y` | Todo sin ratón + `AxeBuilder` sin violaciones `serious`/`critical` | ✅ | — |

Configuración: Chromium (+ WebKit opcional), viewport 1366×768, `trace: 'on-first-retry'`, credenciales demo por variables de entorno.

## 6. Configuración

`vite.config.ts` (igual que task-manager): `test.projects` → `unit` (`**/*.test.{ts,tsx}` excluyendo `*.integration.*`) e `integration` (`**/*.integration.test.{ts,tsx}`), `environment: 'jsdom'`, `setupFiles: './src/setupTests.ts'`, cobertura v8 con `thresholds` 80 % (excluye `main.tsx`, mocks, `*.integration.*`, `environments`).

`src/setupTests.ts`: `jest-dom/vitest`; `server.listen({ onUnhandledRequest: 'error' })`; `cleanup()` + `server.resetHandlers()` tras cada test; `server.close()` al final.

```jsonc
"test":             "vitest run",
"test:watch":       "vitest",
"test:unit":        "vitest run --project unit --coverage",
"test:integration": "vitest run --project integration",
"test:coverage":    "vitest run --coverage",
"e2e":              "playwright test --project=mocked",
"e2e:full-stack":   "playwright test --project=full-stack",
"e2e:ui":           "playwright test --ui"
```

## 7. Criterios de "hecho"
- [ ] Unit happy path de toda pieza nueva.
- [ ] Integración actualizada si cambia el comportamiento de la screen.
- [ ] E2E en verde si se tocó un flujo crítico; axe sin violaciones graves.
- [ ] Sin warnings de `act()` ni peticiones no manejadas.
