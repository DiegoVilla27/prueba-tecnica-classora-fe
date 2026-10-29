/**
 * @fileoverview Unit tests for `SaleTable`.
 * Verifies the empty state and one row per product.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import SaleTable from '.';
import useSaleStore, { initialSaleState } from '../../../store';

describe('Checkout: SaleTable', () => {
  beforeEach(() => useSaleStore.setState(initialSaleState));

  it('should show the empty state without lines', () => {
    // Arrange
    useSaleStore.getState().setSale({ id: 's', status: 'OPEN', version: 0, lines: [] });
    const { Wrapper } = createTestWrapper();

    // Act
    render(<SaleTable />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument();
  });

  it('should render an accessible table with one row per product', async () => {
    // Arrange
    useSaleStore.getState().setSale({
      id: 's',
      status: 'OPEN',
      version: 1,
      lines: [
        {
          id: 'l1',
          productId: 'p1',
          code: '8412345000010',
          name: 'Leche entera 1L',
          unitPrice: 95,
          quantity: 2,
        },
        {
          id: 'l2',
          productId: 'p2',
          code: '8412345000119',
          name: 'Bolsa de papel',
          unitPrice: 10,
          quantity: 3,
        },
      ],
    });
    useSaleStore.getState().selectLine('l2');
    const { Wrapper } = createTestWrapper();

    // Act
    const { container } = render(<SaleTable />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole('table', { name: 'Productos de la venta' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('row', { name: /Bolsa de papel/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expectNoA11yViolations(container);
  });
});
