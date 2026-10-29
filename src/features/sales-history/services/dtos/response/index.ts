import { z } from 'zod';

const SaleStatusSchema = z.enum(['OPEN', 'COMPLETED', 'CANCELLED']);

/** `SaleSummaryResponseDTO` of `GET /sales` (amounts in euros). */
export const SaleSummaryResponseSchema = z.object({
  id: z.uuid(),
  status: SaleStatusSchema,
  itemCount: z.number().int().nonnegative(),
  lineCount: z.number().int().nonnegative(),
  total: z.number().nonnegative(),
  createdAt: z.string(),
  closedAt: z.string().nullable(),
});

/** `SalePageResponseDTO` of `GET /sales`. */
export const SalePageResponseSchema = z.object({
  content: z.array(SaleSummaryResponseSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

/** `SaleResponseDTO` of `GET /sales/{id}`: only the fields the detail shows. */
export const SaleDetailResponseSchema = z.object({
  id: z.uuid(),
  status: SaleStatusSchema,
  lines: z.array(
    z.object({
      id: z.uuid(),
      code: z.string(),
      name: z.string(),
      unitPrice: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      subtotal: z.number().nonnegative(),
    }),
  ),
  itemCount: z.number().int().nonnegative(),
  total: z.number().nonnegative(),
  createdAt: z.string(),
  closedAt: z.string().nullable(),
});

export type SaleSummaryResponseDto = z.infer<typeof SaleSummaryResponseSchema>;
export type SalePageResponseDto = z.infer<typeof SalePageResponseSchema>;
export type SaleDetailResponseDto = z.infer<typeof SaleDetailResponseSchema>;
