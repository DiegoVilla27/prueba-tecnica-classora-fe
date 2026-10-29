/** No product has the scanned code (API 404). Shown inline, it never touches the sale. */
export class ProductNotFoundError extends Error {
  constructor(readonly code: string) {
    super(`Product ${code} not found.`);
    this.name = 'ProductNotFoundError';
  }
}
