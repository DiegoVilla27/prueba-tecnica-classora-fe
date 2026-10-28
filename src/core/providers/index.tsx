import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

/**
 * Creates the TanStack Query client with the app defaults.
 *
 * @remarks
 * One retry for queries (a dropped request at the checkout is retried once); mutations never
 * retry on their own: the sale mutations decide (rollback + "Reintentar").
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });

const defaultQueryClient = createQueryClient();

interface AppProvidersProps {
  children: ReactNode;
  /** Lets tests inject a client without retries. */
  queryClient?: QueryClient;
}

/** Global providers: server state (TanStack Query) and toasts (sonner). */
export const AppProviders = ({ children, queryClient = defaultQueryClient }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster position="bottom-center" />
  </QueryClientProvider>
);

export default AppProviders;
