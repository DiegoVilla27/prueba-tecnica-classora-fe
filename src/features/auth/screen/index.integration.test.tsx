/**
 * @fileoverview Integration tests of the login (CU-00) and the session flow (CU-07).
 * The real routes, guards, services and interceptors run against the MSW auth handlers.
 */
import { environment } from '@core/environments';
import server from '@shared/mocks/server';
import { registerInterceptors, renderRoute } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { DEMO_CREDENTIALS, MOCK_TOKENS } from '../mocks/data';

const fillAndSubmit = async (email: string, password: string) => {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByRole('textbox', { name: 'Email' }), email);
  if (password) await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Entrar en la caja' }));
  return user;
};

describe('Auth: Login Screen Integration', () => {
  let ejectInterceptors: () => void;
  beforeEach(() => {
    ejectInterceptors = registerInterceptors();
  });
  afterEach(() => ejectInterceptors());

  it('L-01: should sign in, store the session and open the checkout with the cashier name', async () => {
    // Arrange
    const { router } = renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    // Assert
    expect(await screen.findByRole('heading', { name: 'Venta en curso' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBe(MOCK_TOKENS.access);
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
  });

  it('L-02: should show the credentials error and clear the password on 401', async () => {
    // Arrange
    renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit(DEMO_CREDENTIALS.email, 'wrong-password');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos.');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(screen.getByLabelText('Contraseña')).toHaveFocus();
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
  });

  it('L-03: should show each validation error under its field without calling the API', async () => {
    // Arrange
    let loginCalls = 0;
    server.use(
      http.post(`${environment.apiUrl}/auth/login`, () => {
        loginCalls += 1;
        return HttpResponse.json({});
      }),
    );
    renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit('', '');

    // Assert
    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(email).toHaveAccessibleDescription('Introduce tu email.');
    expect(email).toHaveFocus();
    expect(screen.getByLabelText('Contraseña')).toHaveAccessibleDescription(
      'Introduce tu contraseña.',
    );
    expect(loginCalls).toBe(0);
  });

  it('should reject a malformed email before calling the API', async () => {
    // Arrange
    renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit('cajero@', 'cajero1234');

    // Assert
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'Introduce un email válido.',
    );
  });

  it('should tell the cashier the server is unreachable when the network fails', async () => {
    // Arrange
    server.use(http.post(`${environment.apiUrl}/auth/login`, () => HttpResponse.error()));
    renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el servidor.',
    );
  });

  it('should warn about too many attempts on 429', async () => {
    // Arrange
    server.use(
      http.post(`${environment.apiUrl}/auth/login`, () =>
        HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 }),
      ),
    );
    renderRoute('/login');
    await screen.findByRole('heading', { name: 'Entra en tu caja' });

    // Act
    await fillAndSubmit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Demasiados intentos.');
  });

  it('should explain an expired session when arriving with ?expired=1', async () => {
    // Arrange
    const path = '/login?expired=1';

    // Act
    renderRoute(path);

    // Assert
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Tu sesión ha caducado. Vuelve a entrar.',
    );
  });

  it('CU-07: should log out from the checkout and go back to the login', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);
    StorageService.set(STORAGE_KEYS.REFRESH, MOCK_TOKENS.refresh);
    const { router } = renderRoute('/');
    const header = await screen.findByRole('banner');
    await within(header).findByText('Ana López');

    // Act
    await userEvent.setup().click(within(header).getByRole('button', { name: 'Salir' }));

    // Assert
    expect(await screen.findByRole('heading', { name: 'Entra en tu caja' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
  });
});
