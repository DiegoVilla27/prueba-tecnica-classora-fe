/**
 * @fileoverview Unit tests for the sales history services.
 * Verifies the page and the detail come back with amounts in cents.
 */
import { BAG, MILK } from '@features/catalog/mocks/data';
import { seedClosedSale, seedOpenSale } from '@features/checkout/mocks/data';
import { getSaleDetailSvc, listSalesSvc } from '.';

describe('Sales history: services', () => {
  it('should list the sales newest first with totals in cents', async () => {
    // Arrange
    const completed = seedClosedSale([
      [MILK.code, 2],
      [BAG.code, 3],
    ]);
    const open = seedOpenSale();

    // Act
    const page = await listSalesSvc(0, 20);

    // Assert
    expect(page.totalElements).toBe(2);
    expect(page.sales.map((sale) => sale.id)).toEqual([open.id, completed.id]);
    expect(page.sales[1]).toMatchObject({
      status: 'COMPLETED',
      itemCount: 5,
      lineCount: 2,
      total: 220,
    });
  });

  it('should load a sale with its lines in cents', async () => {
    // Arrange
    const sale = seedClosedSale([[MILK.code, 2]], 'CANCELLED');

    // Act
    const detail = await getSaleDetailSvc(sale.id);

    // Assert
    expect(detail).toMatchObject({ status: 'CANCELLED', total: 190, lineCount: 1 });
    expect(detail.lines[0]).toMatchObject({
      code: MILK.code,
      unitPrice: 95,
      quantity: 2,
      subtotal: 190,
    });
  });
});
