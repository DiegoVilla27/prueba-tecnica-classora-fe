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
});
