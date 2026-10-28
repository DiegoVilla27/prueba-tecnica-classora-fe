---
name: write-tests
description: Decide y escribe el nivel de test correcto (unit happy path, integración con MSW o E2E con Playwright + axe) con las convenciones de task-manager (AAA, describe por capa, @fileoverview). Usar al añadir o cambiar cualquier comportamiento.
---

# write-tests

## Qué nivel
| Cambio | Unit (`unit`) | Integración (`integration`, MSW) | E2E (Playwright) |
|---|---|---|---|
| model / mapper / util / schema | ✅ happy path (+ bordes de negocio críticos en `models/sale`) | — | — |
| store Zustand | ✅ cada acción + selectores | — | — |
| componente o hook | ✅ happy path | — | — |
| service | ✅ happy path con MSW por defecto | — | — |
| comportamiento de la screen / errores de red | — | ✅ 200, 404, 500, red caída | — |
| flujo crítico (login, escanear→finalizar, código inexistente, eliminar+deshacer, recuperar venta, solo teclado) | — | — | ✅ + axe (`mocked` y/o `full-stack`) |

## Convenciones
- Archivos: `index.test.ts(x)` junto al código · `index.integration.test.tsx` en la screen · `e2e/<flujo>.spec.ts`.
- `@fileoverview` TSDoc arriba del archivo.
- `describe('<Capa>: <nombre>')` (`'UI: button'`, `'Checkout: useSaleStore'`, `'Checkout: Screen Integration'`).
- `it('should <resultado> [when <condición>]')`.
- Bloques `// Arrange`, `// Act`, `// Assert`.
- Queries accesibles (`getByRole`, `getByLabelText`, `findByRole('alert')`); `data-testid` solo como último recurso.
- `const user = userEvent.setup()`; nunca `fireEvent`.
- Store: `beforeEach(() => useSaleStore.setState(initialSaleState))`.
- Unit de hooks: se pueden mockear sus services (`vi.mock('@features/catalog/services', …)`), como en task-manager.
- Integración: **nunca** mockear Axios, interceptores ni el store; la red con MSW y overrides con `server.use(...)`. Para pantallas privadas, sembrar tokens en storage en `beforeEach`.
- Mutaciones optimistas: probar también el **rollback** (handler 500) en integración.
- E2E: preferir teclado; `new AxeBuilder({ page }).analyze()` sin violaciones `serious`/`critical`.

## Plantilla integración
```tsx
/**
 * @fileoverview Integration tests for the checkout screen against MSW handlers.
 */
describe('Checkout: Screen Integration', () => {
  beforeEach(() => useSaleStore.setState(initialSaleState));

  it('should show not found message when code does not exist', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<CheckoutScreen />);

    // Act
    await user.type(screen.getByLabelText(/código de producto/i), '0000{Enter}');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No existe ningún producto con el código 0000',
    );
  });
});
```

## Verificación
`pnpm test` (y `pnpm e2e` si tocaste un flujo crítico) en verde, sin warnings de `act()` ni peticiones no manejadas; cobertura ≥ 80 %.
