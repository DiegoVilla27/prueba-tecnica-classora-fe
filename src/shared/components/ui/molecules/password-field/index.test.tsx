/**
 * @fileoverview Unit tests for the `PasswordField` molecule.
 * Verifies the password can be shown and hidden.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from '.';

describe('UI: PasswordField', () => {
  it('should toggle the password visibility', async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(<PasswordField label="Contraseña" />);
    const input = screen.getByLabelText('Contraseña');

    // Act
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));

    // Assert
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expectNoA11yViolations(container);
  });
});
