/** A catalog product as the checkout uses it. `unitPrice` is in cents. */
export interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
}
