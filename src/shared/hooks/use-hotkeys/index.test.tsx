/**
 * @fileoverview Unit tests for `useHotkeys`.
 * Verifies shortcuts fire, respect inputs and can be disabled.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useHotkeys, { type Hotkey } from '.';

const Harness = ({ hotkeys, enabled }: { hotkeys: Hotkey[]; enabled?: boolean }) => {
  useHotkeys(hotkeys, enabled);
  return <input aria-label="Código de producto" />;
};

describe('Shared: useHotkeys', () => {
  it('should run the handler of a pressed shortcut', async () => {
    // Arrange
    const user = userEvent.setup();
    const finalize = vi.fn();
    const undo = vi.fn();
    render(
      <Harness
        hotkeys={[
          { combo: 'F12', handler: finalize },
          { combo: 'ctrl+z', handler: undo },
        ]}
      />,
    );

    // Act
    await user.keyboard('{F12}{Control>}z{/Control}');

    // Assert
    expect(finalize).toHaveBeenCalledOnce();
    expect(undo).toHaveBeenCalledOnce();
  });

  it('should ignore shortcuts typed in a field unless they allow it', async () => {
    // Arrange
    const user = userEvent.setup();
    const increase = vi.fn();
    const finalize = vi.fn();
    render(
      <Harness
        hotkeys={[
          { combo: '+', handler: increase },
          { combo: 'F12', handler: finalize, allowInInputs: true },
        ]}
      />,
    );

    // Act
    await user.type(screen.getByRole('textbox'), '+{F12}');

    // Assert
    expect(increase).not.toHaveBeenCalled();
    expect(finalize).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox')).toHaveValue('+');
  });

  it('should do nothing while disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    const finalize = vi.fn();
    render(<Harness hotkeys={[{ combo: 'F12', handler: finalize }]} enabled={false} />);

    // Act
    await user.keyboard('{F12}');

    // Assert
    expect(finalize).not.toHaveBeenCalled();
  });
});
