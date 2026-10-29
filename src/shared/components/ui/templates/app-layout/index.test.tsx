/**
 * @fileoverview Unit tests for the `AppLayout` template.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import { AppLayout } from '.';

describe('UI: AppLayout', () => {
  it('should lay out header, main, aside and footer landmarks', async () => {
    // Arrange
    const header = <header>cabecera</header>;

    // Act
    const { container } = render(
      <AppLayout header={header} aside={<p>Total</p>} footer={<p>Atajos</p>}>
        <h1>Venta en curso</h1>
      </AppLayout>,
    );

    // Assert
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Venta en curso' }),
    );
    expect(screen.getByRole('complementary')).toHaveTextContent('Total');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Atajos');
    await expectNoA11yViolations(container);
  });
});
