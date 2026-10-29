/**
 * @fileoverview Unit tests for the `Button` atom.
 * Verifies click, loading state, variants and accessibility.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '.';

describe('UI: Button', () => {
  it('should call onClick when pressed and be a non-submitting button by default', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick}>Añadir</Button>);

    // Act
    await user.click(screen.getByRole('button', { name: 'Añadir' }));

    // Assert
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    await expectNoA11yViolations(container);
  });

  it('should be disabled and busy while loading, showing the loading text', () => {
    // Arrange
    const onClick = vi.fn();

    // Act
    render(
      <Button isLoading loadingText="Finalizando…" onClick={onClick}>
        Finalizar venta
      </Button>,
    );

    // Assert
    const button = screen.getByRole('button', { name: 'Finalizando…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should apply the danger variant and the large size', () => {
    // Arrange
    const props = { variant: 'danger', size: 'lg' } as const;

    // Act
    render(<Button {...props}>Vaciar venta</Button>);

    // Assert
    expect(screen.getByRole('button')).toHaveClass('bg-danger', 'text-on-primary', 'min-h-control');
  });
});
