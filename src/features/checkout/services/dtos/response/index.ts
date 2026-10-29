import { z } from 'zod';

/** `SaleLineResponseDTO` (amounts in euros). */
export const SaleLineResponseSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  code: z.string(),
  name: z.string(),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(999),
  subtotal: z.number().nonnegative(),
});

/** `SaleResponseDTO` of every `/sales` endpoint (amounts in euros). */
export const SaleResponseSchema = z.object({
  id: z.uuid(),
  status: z.enum(['OPEN', 'COMPLETED', 'CANCELLED']),
  cashierId: z.uuid(),
  lines: z.array(SaleLineResponseSchema),
  itemCount: z.number().int().nonnegative(),
  total: z.number().nonnegative(),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  closedAt: z.string().nullable(),
});

export type SaleLineResponseDto = z.infer<typeof SaleLineResponseSchema>;
export type SaleResponseDto = z.infer<typeof SaleResponseSchema>;
