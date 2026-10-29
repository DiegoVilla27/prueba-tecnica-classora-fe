/**
 * Converts an API amount in euros (e.g. `0.95`) to integer cents (`95`).
 *
 * @remarks
 * The only euro → cents conversion of the app, used by the mappers (CLAUDE.md §8): the front
 * never does arithmetic with euro floats.
 *
 * @param euros - Decimal amount with at most 2 decimals.
 * @returns The amount in cents.
 */
export const fromEuros = (euros: number): number => Math.round(euros * 100);
