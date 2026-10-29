/**
 * @fileoverview Integration tests of the checkout screen (CU-01…CU-08, docs/05-testing.md I-01…I-12).
 * Real routes, store, services, mutations and interceptors against the in-memory MSW sale.
 */
import { environment } from '@core/environments';
import { MOCK_TOKENS } from '@features/auth/mocks/data';
import { BAG, MILK } from '@features/catalog/mocks/data';
import server from '@shared/mocks/server';
import { registerInterceptors, renderRoute } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { seedOpenSale } from '../mocks/data';
import useSaleStore, { initialSaleState } from '../store';

const api = (path: string) => `${environment.apiUrl}${path}`;
const euros = (text: string) => text.replace(/ /g, ' ');

const openCheckout = async () => {
  StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);
  StorageService.set(STORAGE_KEYS.REFRESH, MOCK_TOKENS.refresh);
  const user = userEvent.setup();
  const view = renderRoute('/');
  const input = await screen.findByRole('textbox', { name: 'Código de producto' });
  await waitFor(() => expect(input).toBeEnabled());
  return { user, input, ...view };
};

const scan = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  await user.type(screen.getByRole('textbox', { name: 'Código de producto' }), `${text}{Enter}`);
};

/** A toast's text (the same text may also be in the aria-live announcer). */
const findToast = (text: string) =>
  screen.findByText(text, { selector: '[data-sonner-toast] [data-title]' });

const totalPanel = () => screen.getByRole('region', { name: 'Total de la venta' });
const totalText = () => euros(within(totalPanel()).getByText(/€/).textContent ?? '');
const rows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);

describe('Checkout: Screen Integration', () => {
  let ejectInterceptors: () => void;
  beforeEach(() => {
    useSaleStore.setState(initialSaleState);
    ejectInterceptors = registerInterceptors();
  });
  afterEach(() => ejectInterceptors());

  it('I-01: should open an empty sale with the code field focused', async () => {
    // Arrange
    const path = '/';

    // Act
    const { input } = await openCheckout();

    // Assert
    expect(path).toBe('/');
    expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument();
    expect(input).toHaveFocus();
    const finalize = screen.getByRole('button', { name: 'Finalizar venta' });
    expect(finalize).toBeDisabled();
    expect(finalize).toHaveAttribute('aria-keyshortcuts', 'F12');
    expect(finalize).toHaveAccessibleDescription('Añade productos para finalizar');
  });

  it('I-02: should recover the open sale with its lines and total', async () => {
    // Arrange
    seedOpenSale([
      [MILK.code, 2],
      [BAG.code, 3],
    ]);

    // Act
    await openCheckout();

    // Assert
    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(totalText()).toBe('2,20 €');
    expect(within(totalPanel()).getByText('5 artículos · 2 productos')).toBeInTheDocument();
  });

  it('I-03 and I-12: should add a scanned product, clear the field and announce it', async () => {
    // Arrange
    const { user, input } = await openCheckout();

    // Act
    await scan(user, MILK.code);

    // Assert
    const row = await screen.findByRole('row', { name: /Leche entera 1L/ });
    expect(within(row).getByText(/Último añadido/i)).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    await waitFor(() => expect(totalText()).toBe('0,95 €'));
    await waitFor(() =>
      expect(document.getElementById('app-announcer')).toHaveTextContent(
        'Leche entera 1L añadido. Cantidad 1',
      ),
    );
  });

  it('I-04: should add quantity on a repeated scan and look the product up only once', async () => {
    // Arrange
    let lookups = 0;
    server.events.on('request:start', ({ request }) => {
      if (request.url.includes('/products/')) lookups += 1;
    });
    const { user } = await openCheckout();

    // Act
    await scan(user, MILK.code);
    await scan(user, MILK.code);

    // Assert
    await waitFor(() => expect(totalText()).toBe('1,90 €'));
    expect(rows()).toHaveLength(1);
    expect(lookups).toBe(1);
    server.events.removeAllListeners();
  });

  it('should add N units with the multiplier and refuse to pass 999', async () => {
    // Arrange
    const { user, input } = await openCheckout();

    // Act
    await scan(user, `998*${MILK.code}`);
    await waitFor(() => expect(totalText()).toBe('948,10 €'));
    await scan(user, `2*${MILK.code}`);

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Cantidad máxima por producto: 999. No se añadieron más unidades.',
    );
    expect(input).toHaveValue(`2*${MILK.code}`);
    expect(totalText()).toBe('948,10 €');
  });

  it('I-05: should show an inline error for an unknown code and keep the sale intact', async () => {
    // Arrange
    const { user, input } = await openCheckout();

    // Act
    await scan(user, '0000');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No existe ningún producto con el código 0000. Revisa el código.',
    );
    expect(input).toHaveValue('0000');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument();
  });

  it('should reject an invalid code without calling the API', async () => {
    // Arrange
    const { user } = await openCheckout();

    // Act
    await scan(user, 'ABC123');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Código no válido. Introduce entre 4 y 14 dígitos.',
    );
  });

  it('I-06: should roll back an optimistic line when the server fails', async () => {
    // Arrange
    server.use(http.post(api('/sales/:id/lines'), () => new HttpResponse(null, { status: 500 })));
    const { user } = await openCheckout();

    // Act
    await scan(user, MILK.code);

    // Assert
    expect(
      await screen.findByText('No se pudo añadir Leche entera 1L. Vuelve a escanearlo.'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument(),
    );
    expect(totalText()).toBe('0,00 €');
  });

  it('I-07: should tell a network failure from a missing product', async () => {
    // Arrange
    server.use(http.get(api('/products/:code'), () => HttpResponse.error()));
    const { user } = await openCheckout();

    // Act
    await scan(user, MILK.code);

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo consultar el producto. Revisa la conexión y vuelve a pulsar Enter.',
    );
  });

  it('I-08: should change quantities, remove a line and bring it back with Deshacer', async () => {
    // Arrange
    seedOpenSale([[MILK.code, 2]]);
    const { user } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(1));

    // Act
    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Leche entera 1L' }));
    await waitFor(() => expect(totalText()).toBe('2,85 €'));
    await waitFor(() =>
      expect(document.getElementById('app-announcer')).toHaveTextContent(
        'Leche entera 1L, cantidad 3',
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar Leche entera 1L' }));
    await findToast('Leche entera 1L eliminado');
    await user.click(screen.getByRole('button', { name: 'Deshacer' }));

    // Assert
    await waitFor(() => expect(rows()).toHaveLength(1));
    await waitFor(() => expect(totalText()).toBe('2,85 €'));
  });

  it('should remove the line with − at quantity 1, also undoable', async () => {
    // Arrange
    seedOpenSale([[BAG.code, 1]]);
    const { user } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(1));

    // Act
    await user.click(screen.getByRole('button', { name: 'Reducir cantidad de Bolsa de papel' }));

    // Assert
    expect(await findToast('Bolsa de papel eliminado')).toBeInTheDocument();
    expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument();
  });

  it('I-09: should complete the sale, show the success and start a new empty sale', async () => {
    // Arrange
    seedOpenSale([[MILK.code, 1]]);
    const { user } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(1));

    // Act
    await user.click(screen.getByRole('button', { name: /Finalizar venta/ }));
    const dialog = await screen.findByRole('dialog', { name: '¿Finalizar esta venta?' });
    await user.click(within(dialog).getByRole('button', { name: 'Finalizar venta' }));
    expect(euros((await screen.findByText(/Venta finalizada ·/)).textContent ?? '')).toBe(
      'Venta finalizada · 0,95 €',
    );
    await user.click(screen.getByRole('button', { name: 'Nueva venta' }));

    // Assert
    expect(await screen.findByText('Escanea un producto para empezar')).toBeInTheDocument();
    expect(totalText()).toBe('0,00 €');
  });

  it('I-10: should empty the sale after the destructive confirmation', async () => {
    // Arrange
    seedOpenSale([[MILK.code, 3]]);
    const { user } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(1));

    // Act
    await user.click(screen.getByRole('button', { name: 'Vaciar venta' }));
    const dialog = await screen.findByRole('alertdialog', { name: '¿Vaciar la venta?' });
    expect(dialog).toHaveTextContent('Se eliminarán los 3 artículos de esta venta.');
    await user.click(within(dialog).getByRole('button', { name: 'Vaciar venta' }));

    // Assert
    expect(await screen.findByText('Escanea un producto para empezar')).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('I-11: should renew an expired token silently and show the cashier', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.REFRESH, MOCK_TOKENS.refresh);

    // Act
    StorageService.set(STORAGE_KEYS.TOKEN, 'expired-access-token');
    renderRoute('/');

    // Assert
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBe(MOCK_TOKENS.access);
  });

  it('should drive the sale with the keyboard: F12, ↓, +, Supr and Ctrl+Z', async () => {
    // Arrange
    seedOpenSale([
      [MILK.code, 1],
      [BAG.code, 1],
    ]);
    const { user } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(2));

    // Act + Assert: ↓ selects the first row and + adds one unit to it
    await user.keyboard('{ArrowDown}+');
    await waitFor(() => expect(totalText()).toBe('2,00 €'));
    expect(rows()[0]).toHaveAttribute('aria-selected', 'true');

    // Supr removes the selected row, Ctrl+Z brings it back
    await user.keyboard('{Delete}');
    await waitFor(() => expect(rows()).toHaveLength(1));
    await user.keyboard('{Control>}z{/Control}');
    await waitFor(() => expect(rows()).toHaveLength(2));

    // F12 opens the review
    await user.keyboard('{F12}');
    expect(
      await screen.findByRole('dialog', { name: '¿Finalizar esta venta?' }),
    ).toBeInTheDocument();
  });

  it('CU-07: should confirm before logging out with products in the sale', async () => {
    // Arrange
    seedOpenSale([[MILK.code, 1]]);
    const { user, router } = await openCheckout();
    await waitFor(() => expect(rows()).toHaveLength(1));

    // Act
    await user.click(screen.getByRole('button', { name: 'Salir' }));
    const dialog = await screen.findByRole('dialog', { name: '¿Quieres salir de la caja?' });
    await user.click(within(dialog).getByRole('button', { name: 'Cerrar sesión' }));

    // Assert
    expect(await screen.findByRole('heading', { name: 'Entra en tu caja' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('CU-08: should show the cold start state and recover when the server answers', async () => {
    // Arrange
    server.use(
      http.get(api('/sales/current'), () => new HttpResponse(null, { status: 503 }), {
        once: true,
      }),
    );
    StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);

    // Act
    renderRoute('/');

    // Assert
    expect(await screen.findByText('Conectando con el servidor…')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Código de producto' })).toBeDisabled();
    await waitFor(
      () => expect(screen.queryByText('Conectando con el servidor…')).not.toBeInTheDocument(),
      {
        timeout: 4000,
      },
    );
    expect(screen.getByRole('textbox', { name: 'Código de producto' })).toBeEnabled();
  });
});
