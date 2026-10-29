import { ApiError } from '@core/errors/api-error';
import { httpService } from '@core/http';
import type { Sale } from '../models/sale';
import type { AddLineRequestDto, ChangeQuantityRequestDto } from './dtos/request';
import { SaleResponseSchema } from './dtos/response';
import { toSale } from './mappers';

const API_SALES = '/sales';

const parseSale = (data: unknown): Sale => toSale(SaleResponseSchema.parse(data));

/**
 * Loads the cashier's open sale (CU-08).
 *
 * @returns The open sale, or `null` when there is none (404).
 */
const getCurrentSaleSvc = async (): Promise<Sale | null> => {
  try {
    return parseSale(await httpService.get<unknown>(`${API_SALES}/current`));
  } catch (error) {
    if (ApiError.from(error).status === 404) return null;
    throw error;
  }
};

/**
 * Opens a new empty sale.
 *
 * @remarks
 * If another tab already opened one (409, one open sale per cashier), that one is returned.
 *
 * @returns The open sale.
 */
const openSaleSvc = async (): Promise<Sale> => {
  try {
    return parseSale(await httpService.post<unknown>(API_SALES));
  } catch (error) {
    if (ApiError.from(error).status !== 409) throw error;
    const current = await getCurrentSaleSvc();
    if (!current) throw error;
    return current;
  }
};

/** Scans a product into the sale (CU-01). Returns the updated sale. */
const addLineSvc = async (saleId: string, body: AddLineRequestDto): Promise<Sale> =>
  parseSale(
    await httpService.post<unknown, AddLineRequestDto>(`${API_SALES}/${saleId}/lines`, body),
  );

/** Changes a line quantity (CU-02). Returns the updated sale. */
const updateLineSvc = async (
  saleId: string,
  lineId: string,
  body: ChangeQuantityRequestDto,
): Promise<Sale> =>
  parseSale(
    await httpService.patch<unknown, ChangeQuantityRequestDto>(
      `${API_SALES}/${saleId}/lines/${lineId}`,
      body,
    ),
  );

/** Removes a line (CU-03). Returns the updated sale. */
const removeLineSvc = async (saleId: string, lineId: string): Promise<Sale> =>
  parseSale(await httpService.delete<unknown>(`${API_SALES}/${saleId}/lines/${lineId}`));

/** Completes the sale (CU-04). Returns the completed sale. */
const completeSaleSvc = async (saleId: string): Promise<Sale> =>
  parseSale(await httpService.patch<unknown>(`${API_SALES}/${saleId}/complete`));

/** Cancels the sale (CU-05). The API answers 204. */
const cancelSaleSvc = async (saleId: string): Promise<void> => {
  await httpService.patch<void>(`${API_SALES}/${saleId}/cancel`);
};

export {
  addLineSvc,
  cancelSaleSvc,
  completeSaleSvc,
  getCurrentSaleSvc,
  openSaleSvc,
  removeLineSvc,
  updateLineSvc,
};
