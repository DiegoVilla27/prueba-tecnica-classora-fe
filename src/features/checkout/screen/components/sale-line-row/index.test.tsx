/**
 * @fileoverview Unit tests for `SaleLineRow`.
 * Verifies the product data, the "último añadido" label and the row actions.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaleLineRow from '.';

const line = {
  id: 'line-1',
  productId: 'p-milk',
  code: '8412345000010',
  name: 'Leche entera 1L',
  unitPrice: 95,
  quantity: 2,
};

describe('Checkout: SaleLineRow', () => {
  it('should show the product and emit its actions', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlers = { onIncrease: vi.fn(), onDecrease: vi.fn(), onRemove: vi.fn() };
    render(
      <table>
        <tbody>
          <SaleLineRow line={line} isHighlighted isSelected={false} {...handlers} />
        </tbody>
      </table>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Leche entera 1L' }));
    await user.click(screen.getByRole('button', { name: 'Reducir cantidad de Leche entera 1L' }));
    await user.click(screen.getByRole('button', { name: 'Eliminar Leche entera 1L' }));

    // Assert
    const row = screen.getByRole('row');
    expect(row).toHaveTextContent('8412345000010');
    expect(row).toHaveTextContent(/Último añadido/i);
    expect(row.textContent?.replace(/ /g, ' ')).toContain('1,90 €');
    expect(handlers.onIncrease).toHaveBeenCalledWith(line);
    expect(handlers.onDecrease).toHaveBeenCalledWith(line);
    expect(handlers.onRemove).toHaveBeenCalledWith(line);
  });
});
