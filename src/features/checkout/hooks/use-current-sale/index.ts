import { ApiError } from '@core/errors/api-error';
import { useQuery } from '@tanstack/react-query';
import { getCurrentSaleSvc, openSaleSvc } from '../../services';
import useSaleStore from '../../store';

/** Query key of the open sale. */
export const CURRENT_SALE_QUERY_KEY = ['sale', 'current'] as const;

/**
 * Retries while the server is waking up: 1 + 2 + 4 + 8 + 10 + 10 s, enough for Render's cold
 * start (~50 s) on top of each request timeout.
 */
const MAX_COLD_START_RETRIES = 6;
const MAX_RETRY_DELAY_MS = 10_000;

/** Only "no answer" and 5xx are worth retrying; a 4xx will not change by waiting. */
const isServerUnavailable = (error: unknown): boolean => {
  const { status } = ApiError.from(error);
  return status === null || status >= 500;
};

/**
 * Loads the cashier's open sale, or opens a new one (CU-08), and puts it in the store.
 *
 * @remarks
 * While the server does not answer it keeps retrying with back-off: `isConnecting` drives the
 * "Conectando con el servidor…" state of the screen.
 *
 * @returns Loading, connecting and error flags, plus `retry` for the "Reintentar" button.
 */
const useCurrentSale = () => {
  const query = useQuery({
    queryKey: CURRENT_SALE_QUERY_KEY,
    queryFn: async () => {
      const sale = (await getCurrentSaleSvc()) ?? (await openSaleSvc());
      useSaleStore.getState().setSale(sale);
      return sale;
    },
    retry: (failureCount, error) =>
      isServerUnavailable(error) && failureCount < MAX_COLD_START_RETRIES,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, MAX_RETRY_DELAY_MS),
    staleTime: Infinity,
  });

  return {
    isLoading: query.isPending,
    isConnecting: query.isPending && query.failureCount > 0,
    isError: query.isError,
    error: query.error,
    retry: () => void query.refetch(),
  };
};

export default useCurrentSale;
