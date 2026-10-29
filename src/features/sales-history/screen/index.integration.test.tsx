/**
 * @fileoverview Integration tests of the sales history (UC-S09) against the in-memory MSW sales.
 * Real routes, guards, services and interceptors.
 */
import { environment } from '@core/environments';
import { MOCK_TOKENS } from '@features/auth/mocks/data';
import { BAG, MILK } from '@features/catalog/mocks/data';
import { seedClosedSale, seedOpenSale } from '@features/checkout/mocks/data';
import server from '@shared/mocks/server';
import { registerInterceptors, renderRoute } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

const openHistory = () => {
  StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);
  return renderRoute('/ventas');
};

const bodyRows = () =>
  within(screen.getByRole('table', { name: 'Ventas de la caja' }))
    .getAllByRole('row')
    .slice(1);

describe('Sales history: Screen Integration', () => {
  let ejectInterceptors: () => void;
  beforeEach(() => {
    ejectInterceptors = registerInterceptors();
  });
  afterEach(() => ejectInterceptors());

  it('should list the sales newest first and open the detail of one', async () => {
    // Arrange
    const user = userEvent.setup();
    seedClosedSale([
      [MILK.code, 2],
      [BAG.code, 3],
    ]);
    seedClosedSale([[MILK.code, 1]], 'CANCELLED');
    seedOpenSale();

    // Act
    openHistory();
    await screen.findByRole('table', { name: 'Ventas de la caja' });
    await user.click(within(bodyRows()[2]!).getByRole('button', { name: /Ver detalle/ }));

    // Assert
    expect(
      bodyRows().map((row) => within(row).getByText(/Abierta|Cancelada|Finalizada/).textContent),
    ).toEqual(['Abierta', 'Cancelada', 'Finalizada']);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleDescription('Finalizada · 5 artículos · 2 productos');
    expect(await within(dialog).findByText('Leche entera 1L')).toBeInTheDocument();
    expect(within(dialog).getByText('Bolsa de papel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ventas' })).toHaveAttribute('aria-current', 'page');
  });

  it('should page through the history', async () => {
    // Arrange
    const user = userEvent.setup();
    for (let i = 0; i < 21; i += 1) seedClosedSale([[MILK.code, 1]], 'CANCELLED');

    // Act
    openHistory();
    expect(await screen.findByText('Página 1 de 2 · 21 ventas')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    // Assert
    expect(await screen.findByText('Página 2 de 2 · 21 ventas')).toBeInTheDocument();
    await waitFor(() => expect(bodyRows()).toHaveLength(1));
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
  });

  it('should explain a loading error and retry', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(
      http.get(`${environment.apiUrl}/sales`, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );
    seedClosedSale([[MILK.code, 1]]);

    // Act
    openHistory();
    await user.click(await screen.findByRole('button', { name: 'Reintentar' }));

    // Assert
    expect(await screen.findByRole('table', { name: 'Ventas de la caja' })).toBeInTheDocument();
  });

  it('should go back to the checkout from the header', async () => {
    // Arrange
    const user = userEvent.setup();
    const { router } = openHistory();
    await screen.findByText('Todavía no hay ventas');

    // Act
    await user.click(screen.getByRole('link', { name: 'Caja' }));

    // Assert
    expect(await screen.findByRole('heading', { name: 'Venta en curso' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});
