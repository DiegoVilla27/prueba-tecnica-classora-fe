/**
 * @fileoverview Unit tests for the `QuantityStepper` molecule.
 * Verifies − and +, the maximum and accessibility.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityStepper } from '.';

describe('UI: QuantityStepper', () => {
  it('should call decrease and increase from a labelled group', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDecrease = vi.fn();
    const onIncrease = vi.fn();
    const { container } = render(
      <QuantityStepper
        value={2}
        max={999}
        label="Cantidad de Leche entera 1L"
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />,
    );
    const group = screen.getByRole('group', { name: 'Cantidad de Leche entera 1L' });

    // Act
    await user.click(screen.getByRole('button', { name: 'Reducir cantidad' }));
    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad' }));

    // Assert
    expect(group).toHaveTextContent('2');
    expect(onDecrease).toHaveBeenCalledOnce();
    expect(onIncrease).toHaveBeenCalledOnce();
    await expectNoA11yViolations(container);
  });

  it('should disable + at the maximum and keep − enabled at the minimum', () => {
    // Arrange
    const noop = vi.fn();

    // Act
    render(
      <>
        <QuantityStepper value={999} max={999} label="A" onDecrease={noop} onIncrease={noop} />
        <QuantityStepper value={1} max={999} label="B" onDecrease={noop} onIncrease={noop} />
      </>,
    );

    // Assert
    const [atMax, atMin] = screen.getAllByRole('group');
    expect(atMax!.querySelectorAll('button')[1]).toBeDisabled();
    expect(atMin!.querySelectorAll('button')[0]).toBeEnabled();
  });
});
