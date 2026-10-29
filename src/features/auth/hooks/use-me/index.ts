import { useQuery } from '@tanstack/react-query';
import { getMeSvc } from '../../services';

/** Query key of the signed-in cashier; `use-logout` clears it with the rest of the cache. */
export const ME_QUERY_KEY = ['me'] as const;

/**
 * Signed-in cashier for the header (`GET /users/me`).
 *
 * @remarks
 * `staleTime: Infinity`: the cashier does not change during a session, so it is fetched once.
 *
 * @returns The TanStack Query result with the `Cashier`.
 */
const useMe = () =>
  useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMeSvc,
    staleTime: Infinity,
  });

export default useMe;
