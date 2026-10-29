import { useQueryClient } from '@tanstack/react-query';
import type { Product } from '../../models/product';
import { getProductByCodeSvc } from '../../services';

/** A product is looked up once and reused for 5 minutes: rescanning it costs no request. */
const PRODUCT_STALE_TIME_MS = 5 * 60_000;

/** Query key of a product by code. */
export const productQueryKey = (code: string) => ['product', code] as const;

/**
 * Returns a function that looks a product up by code, through the TanStack Query cache.
 *
 * @remarks
 * Uses `fetchQuery` (imperative): the lookup happens when the cashier scans, not on render.
 * Errors are not retried: a 404 is an answer, not a failure.
 *
 * @returns `lookup(code)`, which resolves the product or throws `ProductNotFoundError` / `ApiError`.
 */
const useProductLookup = () => {
  const queryClient = useQueryClient();

  return (code: string): Promise<Product> =>
    queryClient.fetchQuery({
      queryKey: productQueryKey(code),
      queryFn: () => getProductByCodeSvc(code),
      staleTime: PRODUCT_STALE_TIME_MS,
      retry: false,
    });
};

export default useProductLookup;
