/**
 * @fileoverview Unit tests for the route table and its guards.
 * Verifies private, public and unknown routes redirect according to the session.
 */
import { renderRoute } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { screen } from '@testing-library/react';

describe('Core: routes', () => {
  it('should send a cashier without session from the checkout to the login', async () => {
    // Arrange
    const path = '/';

    // Act
    const { router } = renderRoute(path);

    // Assert
    expect(await screen.findByRole('heading', { name: 'Entra en tu caja' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('should show the checkout to a cashier with session', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');

    // Act
    renderRoute('/');

    // Assert
    expect(await screen.findByRole('heading', { name: 'Venta en curso' })).toBeInTheDocument();
  });

  it('should send a cashier with session away from the login', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');

    // Act
    const { router } = renderRoute('/login');

    // Assert
    expect(await screen.findByRole('heading', { name: 'Venta en curso' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('should redirect unknown paths to the checkout', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');

    // Act
    const { router } = renderRoute('/does-not-exist');

    // Assert
    expect(await screen.findByRole('heading', { name: 'Venta en curso' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});
