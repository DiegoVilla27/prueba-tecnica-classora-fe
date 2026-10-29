/**
 * @fileoverview Unit tests for `CheckoutHeader`.
 */
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutHeader from '.';

describe('Checkout: CheckoutHeader', () => {
  it('should show the brand, a loading cashier and the logout action', async () => {
    // Arrange
    const user = userEvent.setup();
    const onLogout = vi.fn();
    const { Wrapper } = createTestWrapper();
    render(<CheckoutHeader onLogout={onLogout} />, { wrapper: Wrapper });

    // Act
    await user.click(screen.getByRole('button', { name: 'Salir' }));

    // Assert
    expect(screen.getByText('Puesto de caja')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Cargando cajero…');
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
