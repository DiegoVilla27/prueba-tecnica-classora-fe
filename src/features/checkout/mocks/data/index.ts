import { demoCashier } from '@features/auth/mocks/data';
import { mockProducts } from '@features/catalog/mocks/data';
import type { SaleResponseDto } from '../../services/dtos/response';

/** Internal line of the in-memory sale (prices in cents, like the backend aggregate). */
interface MockLine {
  id: string;
  productId: string;
  code: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

interface MockSale {
  id: string;
  status: SaleResponseDto['status'];
  lines: MockLine[];
  version: number;
  createdAt: string;
  closedAt: string | null;
}

/** Sales of the demo cashier. Reset after each test (`resetMockSales` in setupTests). */
let sales: MockSale[] = [];

export const resetMockSales = (): void => {
  sales = [];
};

const cents = (euros: number) => Math.round(euros * 100);
const euros = (amount: number) => amount / 100;

/** Renders a mock sale exactly as the API `SaleResponseDTO`. */
export const toSaleResponse = (sale: MockSale): SaleResponseDto => {
  const lines = sale.lines.map((line) => ({
    id: line.id,
    productId: line.productId,
    code: line.code,
    name: line.name,
    unitPrice: euros(line.unitPriceCents),
    quantity: line.quantity,
    subtotal: euros(line.unitPriceCents * line.quantity),
  }));
  return {
    id: sale.id,
    status: sale.status,
    cashierId: demoCashier.id,
    lines,
    itemCount: sale.lines.reduce((count, line) => count + line.quantity, 0),
    total: euros(
      sale.lines.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0),
    ),
    version: sale.version,
    createdAt: sale.createdAt,
    closedAt: sale.closedAt,
  };
};

/**
 * One page of the history as `GET /sales` returns it: summaries, newest first.
 *
 * @param page - Zero-based page.
 * @param size - Page size.
 */
export const listMockSalesPage = (page: number, size: number) => {
  const newestFirst = [...sales].reverse();
  const content = newestFirst.slice(page * size, page * size + size).map((sale) => {
    const response = toSaleResponse(sale);
    return {
      id: response.id,
      status: response.status,
      itemCount: response.itemCount,
      lineCount: response.lines.length,
      total: response.total,
      createdAt: response.createdAt,
      closedAt: response.closedAt,
    };
  });
  return {
    content,
    page,
    size,
    totalElements: sales.length,
    totalPages: Math.ceil(sales.length / size),
  };
};

/**
 * Seeds a closed sale (for the history tests).
 *
 * @param lines - `[code, quantity]` pairs.
 * @param status - `COMPLETED` or `CANCELLED`.
 * @returns The API response of the seeded sale.
 */
export const seedClosedSale = (
  lines: [code: string, quantity: number][],
  status: 'COMPLETED' | 'CANCELLED' = 'COMPLETED',
): SaleResponseDto => {
  const sale = openMockSale();
  lines.forEach(([code, quantity]) => addMockLine(sale, code, quantity));
  closeMockSale(sale, status);
  return toSaleResponse(sale);
};

export const findOpenSale = (): MockSale | undefined =>
  sales.find(({ status }) => status === 'OPEN');

export const findSale = (id: string): MockSale | undefined => sales.find((sale) => sale.id === id);

export const openMockSale = (): MockSale => {
  const sale: MockSale = {
    id: crypto.randomUUID(),
    status: 'OPEN',
    lines: [],
    version: 0,
    createdAt: new Date().toISOString(),
    closedAt: null,
  };
  sales.push(sale);
  return sale;
};

export const findMockProduct = (code: string) => mockProducts.find((p) => p.code === code);

/** Adds a product to a mock sale. Returns `false` when the line would exceed 999. */
export const addMockLine = (sale: MockSale, code: string, quantity: number): boolean => {
  const product = findMockProduct(code);
  if (!product) throw new Error(`Unknown product ${code}`);
  const existing = sale.lines.find((line) => line.productId === product.id);
  if (existing) {
    if (existing.quantity + quantity > 999) return false;
    existing.quantity += quantity;
  } else {
    sale.lines.push({
      id: crypto.randomUUID(),
      productId: product.id,
      code: product.code,
      name: product.name,
      unitPriceCents: cents(product.price),
      quantity,
    });
  }
  touch(sale);
  return true;
};

export const touch = (sale: MockSale): void => {
  sale.version += 1;
};

export const closeMockSale = (sale: MockSale, status: 'COMPLETED' | 'CANCELLED'): void => {
  sale.status = status;
  sale.closedAt = new Date().toISOString();
  touch(sale);
};

/**
 * Seeds an open sale with the given lines (for tests of "recover the open sale").
 *
 * @param lines - `[code, quantity]` pairs.
 * @returns The API response of the seeded sale.
 */
export const seedOpenSale = (lines: [code: string, quantity: number][] = []): SaleResponseDto => {
  const sale = openMockSale();
  lines.forEach(([code, quantity]) => addMockLine(sale, code, quantity));
  return toSaleResponse(sale);
};
