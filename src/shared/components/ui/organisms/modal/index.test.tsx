/**
 * @fileoverview Unit tests for the `Modal` organism.
 * Verifies opening, naming, Esc and the busy state.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, type ModalProps } from '.';

const renderModal = (props: Partial<ModalProps> = {}) =>
  render(
    <Modal
      isOpen
      onClose={vi.fn()}
      overline="Revisar venta"
      title="¿Finalizar esta venta?"
      description="6 artículos · 4 productos."
      actions={
        <>
          <button type="button">Volver a la venta</button>
          <button type="button" data-autofocus>
            Finalizar venta
          </button>
        </>
      }
      {...props}
    />,
  );

describe('UI: Modal', () => {
  it('should open as a dialog named by its title and described by its text', async () => {
    // Arrange
    const props = {};

    // Act
    const { container } = renderModal(props);

    // Assert
    const dialog = screen.getByRole('dialog', { name: '¿Finalizar esta venta?' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAccessibleDescription('6 artículos · 4 productos.');
    expect(screen.getByText('Revisar venta')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('should ask to close on Esc', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal({ onClose });
    screen.getByRole('button', { name: 'Volver a la venta' }).focus();

    // Act
    await user.keyboard('{Escape}');

    // Assert
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should ignore Esc while busy and use alertdialog when destructive', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal({ onClose, isBusy: true, variant: 'destructive', title: '¿Vaciar la venta?' });
    screen.getByRole('button', { name: 'Volver a la venta' }).focus();

    // Act
    await user.keyboard('{Escape}');

    // Assert
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog', { name: '¿Vaciar la venta?' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('should close the native dialog when isOpen turns false', () => {
    // Arrange
    const { rerender } = renderModal();

    // Act
    rerender(<Modal isOpen={false} onClose={vi.fn()} title="x" actions={null} />);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should focus the action marked with data-autofocus when it opens', () => {
    // Arrange
    const props = {};

    // Act
    renderModal(props);

    // Assert
    expect(screen.getByRole('button', { name: 'Finalizar venta' })).toHaveFocus();
  });
});
