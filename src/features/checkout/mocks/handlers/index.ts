import { http, HttpResponse } from 'msw';
import type { AddLineRequestDto, ChangeQuantityRequestDto } from '../../services/dtos/request';
import {
  addMockLine,
  closeMockSale,
  findMockProduct,
  findOpenSale,
  findSale,
  openMockSale,
  toSaleResponse,
  touch,
} from '../data';

const apiError = (status: number, error: string, message: string) =>
  HttpResponse.json(
    { timestamp: new Date().toISOString(), status, error, message, errors: [] },
    { status },
  );

const saleNotFound = () => apiError(404, 'Not Found', 'Sale not found.');
const saleNotOpen = () => apiError(409, 'Conflict', 'The sale is not open.');
const invalidQuantity = () =>
  apiError(422, 'Unprocessable Content', 'Quantity must be between 1 and 999.');

const isValidQuantity = (quantity: unknown): quantity is number =>
  Number.isInteger(quantity) && (quantity as number) >= 1 && (quantity as number) <= 999;

/**
 * In-memory version of the `/sales` API with the same rules as the backend aggregate:
 * one open sale per cashier, one line per product, 1–999 units, no empty completion,
 * immutable once closed.
 */
const handlersCheckout = [
  http.get('*/sales/current', () => {
    const sale = findOpenSale();
    return sale ? HttpResponse.json(toSaleResponse(sale)) : saleNotFound();
  }),

  http.post('*/sales', () => {
    if (findOpenSale()) return apiError(409, 'Conflict', 'The cashier already has an open sale.');
    return HttpResponse.json(toSaleResponse(openMockSale()), { status: 201 });
  }),

  http.post('*/sales/:saleId/lines', async ({ params, request }) => {
    const sale = findSale(String(params.saleId));
    if (!sale) return saleNotFound();
    if (sale.status !== 'OPEN') return saleNotOpen();
    const { code, quantity } = (await request.json()) as AddLineRequestDto;
    if (!isValidQuantity(quantity)) return invalidQuantity();
    if (!findMockProduct(code)) return apiError(404, 'Not Found', 'Product not found.');
    if (!addMockLine(sale, code, quantity)) return invalidQuantity();
    return HttpResponse.json(toSaleResponse(sale));
  }),

  http.patch('*/sales/:saleId/lines/:lineId', async ({ params, request }) => {
    const sale = findSale(String(params.saleId));
    if (!sale) return saleNotFound();
    if (sale.status !== 'OPEN') return saleNotOpen();
    const line = sale.lines.find(({ id }) => id === params.lineId);
    if (!line) return apiError(404, 'Not Found', 'Sale line not found.');
    const { quantity } = (await request.json()) as ChangeQuantityRequestDto;
    if (!isValidQuantity(quantity)) return invalidQuantity();
    line.quantity = quantity;
    touch(sale);
    return HttpResponse.json(toSaleResponse(sale));
  }),

  http.delete('*/sales/:saleId/lines/:lineId', ({ params }) => {
    const sale = findSale(String(params.saleId));
    if (!sale) return saleNotFound();
    if (sale.status !== 'OPEN') return saleNotOpen();
    const index = sale.lines.findIndex(({ id }) => id === params.lineId);
    if (index === -1) return apiError(404, 'Not Found', 'Sale line not found.');
    sale.lines.splice(index, 1);
    touch(sale);
    return HttpResponse.json(toSaleResponse(sale));
  }),

  http.patch('*/sales/:saleId/complete', ({ params }) => {
    const sale = findSale(String(params.saleId));
    if (!sale) return saleNotFound();
    if (sale.status !== 'OPEN') return saleNotOpen();
    if (sale.lines.length === 0) {
      return apiError(422, 'Unprocessable Content', 'An empty sale cannot be completed.');
    }
    closeMockSale(sale, 'COMPLETED');
    return HttpResponse.json(toSaleResponse(sale));
  }),

  http.patch('*/sales/:saleId/cancel', ({ params }) => {
    const sale = findSale(String(params.saleId));
    if (!sale) return saleNotFound();
    if (sale.status !== 'OPEN') return saleNotOpen();
    closeMockSale(sale, 'CANCELLED');
    return new HttpResponse(null, { status: 204 });
  }),
];

export default handlersCheckout;
