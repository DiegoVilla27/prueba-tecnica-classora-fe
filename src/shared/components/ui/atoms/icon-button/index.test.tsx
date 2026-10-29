/**
 * @fileoverview Unit tests for the `IconButton` atom.
 * Verifies its accessible name, click and disabled state.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Trash2 } from 'lucide-react';
import { IconButton } from '.';

describe('UI: IconButton', () => {
  it('should be named by its aria-label and react to clicks', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <IconButton
        aria-label="Eliminar Leche entera 1L"
        icon={<Trash2 />}
        variant="danger"
        onClick={onClick}
      />,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Eliminar Leche entera 1L' }));

    // Assert
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button')).toHaveClass('size-target');
    await expectNoA11yViolations(container);
  });

  it('should not react when disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton
        aria-label="Aumentar cantidad"
        icon="+"
        variant="outline"
        disabled
        onClick={onClick}
      />,
    );

    // Act
    await user.click(screen.getByRole('button'));

    // Assert
    expect(onClick).not.toHaveBeenCalled();
  });
});
