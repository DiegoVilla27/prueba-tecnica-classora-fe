/**
 * @fileoverview Unit tests for the `Input` atom.
 * Verifies typing, the error state and the end slot.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '.';

describe('UI: Input', () => {
  it('should accept typed text', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Input aria-label="Código de producto" />);

    // Act
    await user.type(screen.getByRole('textbox', { name: 'Código de producto' }), '8412345000010');

    // Assert
    expect(screen.getByRole('textbox')).toHaveValue('8412345000010');
  });

  it('should mark itself invalid and render the end slot', () => {
    // Arrange
    const endSlot = <button type="button">Mostrar</button>;

    // Act
    render(<Input aria-label="Contraseña" invalid size="lg" endSlot={endSlot} />);

    // Assert
    const input = screen.getByRole('textbox', { name: 'Contraseña' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-danger', 'min-h-control');
    expect(screen.getByRole('button', { name: 'Mostrar' })).toBeInTheDocument();
  });
});
