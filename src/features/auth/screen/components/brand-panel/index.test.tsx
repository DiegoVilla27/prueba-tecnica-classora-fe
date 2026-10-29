/**
 * @fileoverview Unit tests for the `BrandPanel` component.
 * Verifies the brand copy of the login frame.
 */
import { render, screen } from '@testing-library/react';
import BrandPanel from '.';

describe('Auth: BrandPanel', () => {
  it('should show the brand and the welcome copy', () => {
    // Arrange
    const headline = 'Todo listo. Vamos con la siguiente venta.';

    // Act
    render(<BrandPanel />);

    // Assert
    expect(screen.getByText('classora / TPV')).toBeInTheDocument();
    expect(screen.getByText(headline)).toBeInTheDocument();
    expect(screen.getByText('Puesto de caja')).toBeInTheDocument();
  });
});
