/**
 * @fileoverview Unit tests for `FinalizeSaleModal` and `ClearSaleModal`.
 * Verifies their texts, actions and error state.
 */
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinalizeSaleModal from '.';
import useSaleStore, { initialSaleState } from '../../../store';
import ClearSaleModal from '../clear-sale-modal';

const saleWith = (quantity: number) => ({
  id: 's',
  status: 'OPEN' as const,
  version: 1,
  lines: [{ id: 'l1', productId: 'p1', code: '1', name: 'Leche', unitPrice: 95, quantity }],
});

describe('Checkout: sale modals', () => {
  beforeEach(() => useSaleStore.setState({ ...initialSaleState, sale: saleWith(6) }));

  it('should review the sale and confirm it', async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const { Wrapper } = createTestWrapper();
    render(
      <FinalizeSaleModal
        isOpen
        isPending={false}
        error={null}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
      {
        wrapper: Wrapper,
      },
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Finalizar venta' }));

    // Assert
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription(
      '6 artículos · 1 producto. Comprueba el total antes de confirmar.',
    );
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('should show the error when completing fails', () => {
    // Arrange
    const error = 'No se pudo finalizar la venta. La venta sigue abierta: vuelve a intentarlo.';

    // Act
    render(
      <FinalizeSaleModal
        isOpen
        isPending={false}
        error={error}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(error);
  });

  it('should warn before emptying the sale and show its error', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ClearSaleModal
        isOpen
        isPending={false}
        error="No se pudo vaciar la venta."
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Volver a la venta' }));

    // Assert
    expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription(
      'Se eliminarán los 6 artículos de esta venta. Esta acción no se puede deshacer.',
    );
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo vaciar la venta.');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
