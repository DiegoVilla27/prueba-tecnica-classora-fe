import { httpService } from '@core/http';
import type { SaleDetail, SalesPage } from '../models/sale-record';
import { SaleDetailResponseSchema, SalePageResponseSchema } from './dtos/response';
import { toSaleDetail, toSalesPage } from './mappers';

const API_SALES = '/sales';

/**
 * Loads one page of the cashier's sales, newest first.
 *
 * @param page - Zero-based page.
 * @param size - Sales per page (1–100).
 * @returns The page with amounts in cents.
 */
const listSalesSvc = async (page: number, size: number): Promise<SalesPage> => {
  const data = await httpService.get<unknown>(API_SALES, { params: { page, size } });
  return toSalesPage(SalePageResponseSchema.parse(data));
};

/**
 * Loads a sale with its lines.
 *
 * @param saleId - Sale id.
 * @returns The sale detail with amounts in cents.
 */
const getSaleDetailSvc = async (saleId: string): Promise<SaleDetail> => {
  const data = await httpService.get<unknown>(`${API_SALES}/${saleId}`);
  return toSaleDetail(SaleDetailResponseSchema.parse(data));
};

export { getSaleDetailSvc, listSalesSvc };
