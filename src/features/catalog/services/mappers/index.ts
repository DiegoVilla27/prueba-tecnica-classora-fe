import { fromEuros } from '@shared/utils/money';
import type { Product } from '../../models/product';
import type { ProductResponseDto } from '../dtos/response';

/**
 * Maps the API product (price in euros) to the domain model (price in cents).
 *
 * @param dto - Validated API response.
 * @returns The product.
 */
export const toProduct = (dto: ProductResponseDto): Product => ({
  id: dto.id,
  code: dto.code,
  name: dto.name,
  unitPrice: fromEuros(dto.price),
});
