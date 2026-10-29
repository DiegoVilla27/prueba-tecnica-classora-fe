/**
 * @fileoverview Unit tests for the `LoginScreen`.
 * Verifies it composes the brand panel and the form without accessibility violations.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import LoginScreen from '.';

describe('Auth: LoginScreen', () => {
  it('should render the brand panel and the login form', async () => {
    // Arrange
    const { Wrapper } = createTestWrapper('/login');

    // Act
    const { container } = render(<LoginScreen />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole('complementary')).toHaveTextContent('Puesto de caja');
    expect(screen.getByRole('heading', { level: 1, name: 'Entra en tu caja' })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
