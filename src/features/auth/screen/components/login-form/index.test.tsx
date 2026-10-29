/**
 * @fileoverview Unit tests for the `LoginForm` component.
 * Verifies the fields, the submit button and accessibility.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import LoginForm from '.';

describe('Auth: LoginForm', () => {
  it('should render the labelled fields and the submit button', async () => {
    // Arrange
    const { Wrapper } = createTestWrapper('/login');

    // Act
    const { container } = render(<LoginForm />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole('form', { name: 'Entra en tu caja' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'autocomplete',
      'username',
    );
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Entrar en la caja' })).toHaveAttribute(
      'type',
      'submit',
    );
    await expectNoA11yViolations(container);
  });
});
