/**
 * @fileoverview Unit tests for the `AuthLayout` template.
 * Verifies the brand panel and the form slots.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import { AuthLayout } from '.';

describe('UI: AuthLayout', () => {
  it('should render the brand panel and the main content', async () => {
    // Arrange
    const aside = <p>Todo listo.</p>;

    // Act
    const { container } = render(
      <AuthLayout aside={aside}>
        <h1>Entra en tu caja</h1>
      </AuthLayout>,
    );

    // Assert
    expect(screen.getByRole('complementary')).toHaveTextContent('Todo listo.');
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Entra en tu caja' }),
    );
    await expectNoA11yViolations(container);
  });
});
