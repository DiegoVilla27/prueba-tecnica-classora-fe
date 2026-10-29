import { LIMITS } from '../../constants/limits';

/** A line quantity outside 1–999 (RN-02). */
export class InvalidQuantityError extends Error {
  constructor(readonly quantity: number) {
    super(`Quantity must be between ${LIMITS.minQuantity} and ${LIMITS.maxQuantity}.`);
    this.name = 'InvalidQuantityError';
  }
}

/**
 * Whether a quantity is allowed on a line (RN-02).
 *
 * @param quantity - Candidate quantity.
 * @returns `true` for whole numbers between 1 and 999.
 */
export const isValidQuantity = (quantity: number): boolean =>
  Number.isInteger(quantity) && quantity >= LIMITS.minQuantity && quantity <= LIMITS.maxQuantity;
