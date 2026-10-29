import type { Cashier } from '../../models/cashier';
import type { UserMeResponseDto } from '../dtos/response';

/**
 * Maps `GET /users/me` to the domain cashier.
 *
 * @param dto - Validated API response.
 * @returns The cashier.
 */
export const toCashier = (dto: UserMeResponseDto): Cashier => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  email: dto.email,
});
