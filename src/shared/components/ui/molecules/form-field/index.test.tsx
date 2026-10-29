/**
 * @fileoverview Unit tests for the `FormField` molecule.
 * Verifies label, hint and error are wired to the input.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import { FormField } from '.';

describe('UI: FormField', () => {
  it('should describe the input with its hint', async () => {
    // Arrange
    const hint = 'Escanea un código y pulsa Enter.';

    // Act
    const { container } = render(<FormField label="Código de producto" helperText={hint} />);

    // Assert
    expect(screen.getByRole('textbox', { name: 'Código de producto' })).toHaveAccessibleDescription(
      hint,
    );
    await expectNoA11yViolations(container);
  });

  it('should show the error as an alert linked to an invalid input', async () => {
    // Arrange
    const error = 'Introduce un email válido.';

    // Act
    const { container } = render(<FormField label="Email" type="email" error={error} />);

    // Assert
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(error);
    expect(screen.getByRole('alert')).toHaveTextContent(error);
    await expectNoA11yViolations(container);
  });
});
