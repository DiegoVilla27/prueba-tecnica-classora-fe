/**
 * @fileoverview Unit tests for the `Alert` molecule.
 * Verifies errors and info messages use the right live role.
 */
import { render, screen } from '@testing-library/react';
import { Alert } from '.';

describe('UI: Alert', () => {
  it('should announce errors as alerts and info as status', () => {
    // Arrange
    const error = 'Email o contraseña incorrectos.';
    const info = 'Tu sesión ha caducado. Vuelve a entrar.';

    // Act
    render(
      <>
        <Alert>{error}</Alert>
        <Alert variant="info">{info}</Alert>
      </>,
    );

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(error);
    expect(screen.getByRole('status')).toHaveTextContent(info);
  });

  it('should announce a success politely with its check icon', () => {
    // Arrange
    const message = 'Venta finalizada · 14,94 €';

    // Act
    const { container } = render(<Alert variant="success">{message}</Alert>);

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent(message);
    expect(container.querySelector('svg')).toHaveClass('lucide-circle-check');
  });
});
