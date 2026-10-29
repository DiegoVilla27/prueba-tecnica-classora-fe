import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { SALES_PAGE_SIZE } from '../../constants/messages';
import { listSalesSvc } from '../../services';

/** Query key of a page of the history. */
export const salesPageQueryKey = (page: number) => ['sales', 'history', page] as const;

/**
 * One page of the sales history.
 *
 * @remarks
 * Keeps the previous page on screen while the next one loads, so the table does not flash.
 * Not cached across visits (`staleTime` 0): coming back from the checkout shows the new sales.
 *
 * @param page - Zero-based page.
 * @returns The TanStack Query result with the `SalesPage`.
 */
const useSalesPage = (page: number) =>
  useQuery({
    queryKey: salesPageQueryKey(page),
    queryFn: () => listSalesSvc(page, SALES_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

export default useSalesPage;
