import { httpService } from '@core/http';
import { ApiError } from '@core/errors/api-error';
import { ProductNotFoundError } from '../errors/product-not-found';
import type { Product } from '../models/product';
import { ProductResponseSchema } from './dtos/response';
import { toProduct } from './mappers';

const API_PRODUCTS = '/products';

/**
 * Looks a product up by its scanned code.
 *
 * @param code - Digits only (the scan form validates it first).
 * @returns The product, price in cents.
 * @throws {ProductNotFoundError} When no product has the code (404).
 * @throws {ApiError} On any other failure (network, 5xx…).
 */
const getProductByCodeSvc = async (code: string): Promise<Product> => {
  try {
    const data = await httpService.get<unknown>(`${API_PRODUCTS}/${encodeURIComponent(code)}`);
    return toProduct(ProductResponseSchema.parse(data));
  } catch (error) {
    if (ApiError.from(error).status === 404) throw new ProductNotFoundError(code);
    throw error;
  }
};

export { getProductByCodeSvc };
