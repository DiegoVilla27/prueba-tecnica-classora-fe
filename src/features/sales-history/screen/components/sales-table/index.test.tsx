/**
 * @fileoverview Unit tests for `SalesTable`.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SalesTable from '.';
import type { SaleSummary } from '../../../models/sale-record';

const sale: SaleSummary = {
  id: 's1',
  status: 'COMPLETED',
  itemCount: 6,
  lineCount: 4,
  total: 1494,
  createdAt: '2026-10-29T13:55:00Z',
  closedAt: '2026-10-29T13:58:00Z',
};

describe('Sales history: SalesTable', () => {
  it('should show each sale with its status and open its detail', async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const { container } = render(<SalesTable sales={[sale]} onOpen={onOpen} />);

    // Act
    await user.click(
      screen.getByRole('button', { name: /Ver detalle de la venta del 29\/10\/26/ }),
    );

    // Assert
    const row = screen.getAllByRole('row')[1]!;
    expect(row).toHaveTextContent('Finalizada');
    expect(row.textContent?.replace(/ /g, ' ')).toContain('14,94 €');
    expect(onOpen).toHaveBeenCalledWith(sale);
    await expectNoA11yViolations(container);
  });
});
