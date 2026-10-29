import { multiplyMoney, type Money } from '../money';

/** A row of the ticket: one per distinct product, with its price frozen when scanned (RN-05). */
export interface SaleLine {
  id: string;
  productId: string;
  code: string;
  name: string;
  unitPrice: Money;
  quantity: number;
}

/** Line amount (RN-03). */
export const lineSubtotal = (line: SaleLine): Money => multiplyMoney(line.unitPrice, line.quantity);
