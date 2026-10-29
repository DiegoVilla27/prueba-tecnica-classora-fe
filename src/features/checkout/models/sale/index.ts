import type { Product } from '@features/catalog';
import { LIMITS } from '../../constants/limits';
import { addMoney, type Money } from '../money';
import { InvalidQuantityError, isValidQuantity } from '../quantity';
import { lineSubtotal, type SaleLine } from '../sale-line';

export type SaleStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED';

/**
 * The sale on screen: a copy of the server aggregate. These functions repeat the backend
 * rules so the screen can update optimistically; the server response always wins.
 */
export interface Sale {
  id: string;
  status: SaleStatus;
  version: number;
  lines: SaleLine[];
}

/** A removed line, kept to undo the removal. */
export interface RemovedLine {
  line: SaleLine;
}

/** Adding units would leave a line above 999 (RN-02): nothing is added. */
export class MaxQuantityExceededError extends Error {
  constructor(readonly code: string) {
    super(`Maximum quantity per product is ${LIMITS.maxQuantity}.`);
    this.name = 'MaxQuantityExceededError';
  }
}

/** Temporary id of an optimistic line until the server returns the real one. */
const optimisticLineId = (productId: string): string => `optimistic-${productId}`;

/**
 * Scans a product: a new line, or more units on its existing line (RN-01).
 *
 * @param sale - Current sale.
 * @param product - Scanned product (price frozen from it, RN-05).
 * @param quantity - Units to add (1–999).
 * @returns A new sale.
 * @throws {InvalidQuantityError} When `quantity` is outside 1–999.
 * @throws {MaxQuantityExceededError} When the line would go above 999.
 */
export const addProductToSale = (sale: Sale, product: Product, quantity = 1): Sale => {
  if (!isValidQuantity(quantity)) throw new InvalidQuantityError(quantity);

  const existing = sale.lines.find((line) => line.productId === product.id);
  if (!existing) {
    const line: SaleLine = {
      id: optimisticLineId(product.id),
      productId: product.id,
      code: product.code,
      name: product.name,
      unitPrice: product.unitPrice,
      quantity,
    };
    return { ...sale, lines: [...sale.lines, line] };
  }

  const nextQuantity = existing.quantity + quantity;
  if (nextQuantity > LIMITS.maxQuantity) throw new MaxQuantityExceededError(product.code);
  return {
    ...sale,
    lines: sale.lines.map((line) =>
      line.id === existing.id ? { ...line, quantity: nextQuantity } : line,
    ),
  };
};

/**
 * Sets the quantity of a line (RN-02).
 *
 * @throws {InvalidQuantityError} When `quantity` is outside 1–999.
 */
export const changeLineQuantity = (sale: Sale, lineId: string, quantity: number): Sale => {
  if (!isValidQuantity(quantity)) throw new InvalidQuantityError(quantity);
  return {
    ...sale,
    lines: sale.lines.map((line) => (line.id === lineId ? { ...line, quantity } : line)),
  };
};

/**
 * Removes a line and returns it so the removal can be undone.
 *
 * @returns The new sale and the removed line.
 * @throws {Error} When the line is not in the sale.
 */
export const removeLine = (sale: Sale, lineId: string): { sale: Sale; removed: RemovedLine } => {
  const line = sale.lines.find((candidate) => candidate.id === lineId);
  if (!line) throw new Error(`Line ${lineId} is not in the sale.`);
  return {
    sale: { ...sale, lines: sale.lines.filter((candidate) => candidate.id !== lineId) },
    removed: { line },
  };
};

/**
 * Undoes a removal. The line goes back **at the end**, as `POST /sales/{id}/lines` does on the
 * server, so the row does not jump when the response arrives.
 */
export const restoreLine = (sale: Sale, { line }: RemovedLine): Sale => ({
  ...sale,
  lines: [...sale.lines, { ...line, id: optimisticLineId(line.productId) }],
});

/** Sale total (RN-04). */
export const saleTotal = (sale: Sale): Money =>
  sale.lines.reduce((total, line) => addMoney(total, lineSubtotal(line)), 0);

/** Number of units ("6 artículos"). */
export const itemCount = (sale: Sale): number =>
  sale.lines.reduce((count, line) => count + line.quantity, 0);

/** Number of distinct products ("4 productos"). */
export const lineCount = (sale: Sale): number => sale.lines.length;

/** Only an open sale with lines can be completed (RN-06, RN-07). */
export const canCompleteSale = (sale: Sale): boolean =>
  sale.status === 'OPEN' && sale.lines.length > 0;
