import { z } from 'zod';

/** `ProductResponseDTO` of `GET /products/{code}` (price in euros, 2 decimals). */
export const ProductResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
});
export type ProductResponseDto = z.infer<typeof ProductResponseSchema>;
