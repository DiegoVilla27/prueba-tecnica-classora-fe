/**
 * Money in integer **cents** (value object). The front never does arithmetic with euro
 * floats: API decimals become cents once, in the mappers, with `@shared/utils/money`.
 */
export type Money = number;

/** Sums two amounts. */
export const addMoney = (a: Money, b: Money): Money => a + b;

/** Multiplies an amount by a quantity (line subtotal). */
export const multiplyMoney = (amount: Money, quantity: number): Money => amount * quantity;
