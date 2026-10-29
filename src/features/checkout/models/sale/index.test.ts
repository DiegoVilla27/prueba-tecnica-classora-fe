/**
 * @fileoverview Unit tests for the sale aggregate functions (RN-01…RN-07).
 * They mirror the backend rules and drive the optimistic updates.
 */
import type { Product } from '@features/catalog';
import {
  addProductToSale,
  canCompleteSale,
  changeLineQuantity,
  itemCount,
  lineCount,
  MaxQuantityExceededError,
  removeLine,
  restoreLine,
  saleTotal,
  type Sale,
} from '.';
import { InvalidQuantityError } from '../quantity';

const milk: Product = {
  id: 'p-milk',
  code: '8412345000010',
  name: 'Leche entera 1L',
  unitPrice: 95,
};
const bag: Product = { id: 'p-bag', code: '8412345000119', name: 'Bolsa de papel', unitPrice: 10 };
const emptySale: Sale = { id: 'sale-1', status: 'OPEN', version: 0, lines: [] };

describe('Checkout: sale', () => {
  it('should add a new product as a line with its frozen price', () => {
    // Arrange
    const sale = emptySale;

    // Act
    const result = addProductToSale(sale, milk);

    // Assert
    expect(result.lines).toEqual([
      expect.objectContaining({ productId: 'p-milk', code: milk.code, unitPrice: 95, quantity: 1 }),
    ]);
    expect(sale.lines).toEqual([]); // immutable
  });

  it('should add quantity to the existing line when the product is scanned again (RN-01)', () => {
    // Arrange
    const sale = addProductToSale(emptySale, milk);

    // Act
    const result = addProductToSale(sale, milk, 2);

    // Assert
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]?.quantity).toBe(3);
  });

  it('should refuse to go over 999 units and leave the sale untouched (RN-02)', () => {
    // Arrange
    const sale = addProductToSale(emptySale, milk, 998);

    // Act
    const action = () => addProductToSale(sale, milk, 2);

    // Assert
    expect(action).toThrow(MaxQuantityExceededError);
  });

  it('should compute totals, items and lines in cents (RN-03, RN-04)', () => {
    // Arrange
    const sale = addProductToSale(addProductToSale(emptySale, milk, 2), bag, 3);

    // Act
    const totals = { total: saleTotal(sale), items: itemCount(sale), lines: lineCount(sale) };

    // Assert
    expect(totals).toEqual({ total: 220, items: 5, lines: 2 });
  });

  it('should change a line quantity within 1–999', () => {
    // Arrange
    const sale = addProductToSale(emptySale, milk);
    const lineId = sale.lines[0]!.id;

    // Act
    const result = changeLineQuantity(sale, lineId, 4);

    // Assert
    expect(result.lines[0]?.quantity).toBe(4);
    expect(() => changeLineQuantity(sale, lineId, 0)).toThrow(InvalidQuantityError);
    expect(() => changeLineQuantity(sale, lineId, 1000)).toThrow(InvalidQuantityError);
  });

  it('should remove a line and restore it at the end, like the API does', () => {
    // Arrange
    const sale = addProductToSale(addProductToSale(emptySale, milk), bag);
    const milkLineId = sale.lines[0]!.id;

    // Act
    const { sale: withoutMilk, removed } = removeLine(sale, milkLineId);
    const restored = restoreLine(withoutMilk, removed);

    // Assert
    expect(withoutMilk.lines.map((line) => line.code)).toEqual([bag.code]);
    expect(restored.lines.map((line) => line.code)).toEqual([bag.code, milk.code]);
    expect(restored.lines[1]?.quantity).toBe(1);
  });

  it('should only allow completing an open sale with lines (RN-06, RN-07)', () => {
    // Arrange
    const withLines = addProductToSale(emptySale, milk);

    // Act
    const results = [emptySale, withLines, { ...withLines, status: 'COMPLETED' as const }].map(
      canCompleteSale,
    );

    // Assert
    expect(results).toEqual([false, true, false]);
  });
});
