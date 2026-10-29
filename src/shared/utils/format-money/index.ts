const euroFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

/**
 * Formats integer cents as Spanish euros: `1494` → `"14,94 €"`.
 *
 * @remarks
 * The only place where money becomes text (CLAUDE.md §8).
 *
 * @param cents - Amount in cents.
 * @returns The formatted amount.
 */
export const formatMoney = (cents: number): string => euroFormatter.format(cents / 100);
