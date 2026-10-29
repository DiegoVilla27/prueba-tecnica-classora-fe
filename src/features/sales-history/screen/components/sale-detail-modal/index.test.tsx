/**
 * @fileoverview Unit tests for `SaleDetailModal`.
 */
import { BAG, MILK } from '@features/catalog/mocks/data';
import { seedClosedSale } from '@features/checkout/mocks/data';
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaleDetailModal from '.';
import type { SaleSummary } from '../../../models/sale-record';

const summaryOf = (id: string, createdAt: string, lineCount: number): SaleSummary => ({
  id,
  status: 'COMPLETED',
  itemCount: 5,
  lineCount,
  total: 220,
  createdAt,
  closedAt: createdAt,
});

describe('Sales history: SaleDetailModal', () => {
  it('should list the lines and the total of the sale and close', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const seeded = seedClosedSale([
      [MILK.code, 2],
      [BAG.code, 3],
    ]);
    const { Wrapper } = createTestWrapper();
    render(<SaleDetailModal sale={summaryOf(seeded.id, seeded.createdAt, 2)} onClose={onClose} />, {
      wrapper: Wrapper,
    });

    // Act
    const dialog = screen.getByRole('dialog');
    const lines = await within(dialog).findByRole('table');
    await user.click(within(dialog).getByRole('button', { name: 'Cerrar' }));

    // Assert
    expect(dialog).toHaveAccessibleDescription('Finalizada · 5 artículos · 2 productos');
    expect(within(lines).getAllByRole('row')).toHaveLength(3);
    expect(dialog.textContent?.replace(/ /g, ' ')).toContain('2,20 €');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should say when the sale has no products', async () => {
    // Arrange
    const seeded = seedClosedSale([], 'CANCELLED');
    const { Wrapper } = createTestWrapper();

    // Act
    render(<SaleDetailModal sale={summaryOf(seeded.id, seeded.createdAt, 0)} onClose={vi.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(await screen.findByText('Esta venta no tiene productos.')).toBeInTheDocument();
  });
});
