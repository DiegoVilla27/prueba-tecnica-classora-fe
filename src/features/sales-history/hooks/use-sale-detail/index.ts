import { useQuery } from '@tanstack/react-query';
import { getSaleDetailSvc } from '../../services';

/**
 * Lines and totals of one sale, loaded when the detail modal opens.
 *
 * @param saleId - Sale to load, or `null` while no sale is selected.
 * @returns The TanStack Query result with the `SaleDetail`.
 */
const useSaleDetail = (saleId: string | null) =>
  useQuery({
    queryKey: ['sales', 'detail', saleId],
    queryFn: () => getSaleDetailSvc(saleId as string),
    enabled: saleId !== null,
  });

export default useSaleDetail;
