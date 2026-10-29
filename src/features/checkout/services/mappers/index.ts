import { fromEuros } from '@shared/utils/money';
import type { Sale } from '../../models/sale';
import type { SaleResponseDto } from '../dtos/response';

/**
 * Maps the API sale to the domain sale (prices in cents).
 *
 * @remarks
 * Subtotals and total are not copied: the domain computes them from price × quantity, and
 * the API values are the same by construction (same rules, same rounding).
 *
 * @param dto - Validated API response.
 * @returns The sale.
 */
export const toSale = (dto: SaleResponseDto): Sale => ({
  id: dto.id,
  status: dto.status,
  version: dto.version,
  lines: dto.lines.map((line) => ({
    id: line.id,
    productId: line.productId,
    code: line.code,
    name: line.name,
    unitPrice: fromEuros(line.unitPrice),
    quantity: line.quantity,
  })),
});
