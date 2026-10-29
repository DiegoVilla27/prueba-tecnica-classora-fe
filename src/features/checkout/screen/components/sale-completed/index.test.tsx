/**
 * @fileoverview Unit tests for `SaleCompleted`.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaleCompleted from '.';

describe('Checkout: SaleCompleted', () => {
  it('should show the paid total and start the next sale', async () => {
    // Arrange
    const user = userEvent.setup();
    const onNewSale = vi.fn();
    render(<SaleCompleted total={1494} onNewSale={onNewSale} isStarting={false} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Nueva venta' }));

    // Assert
    expect(screen.getByText(/Venta finalizada · 14,94/)).toBeInTheDocument();
    expect(onNewSale).toHaveBeenCalledOnce();
  });
});
