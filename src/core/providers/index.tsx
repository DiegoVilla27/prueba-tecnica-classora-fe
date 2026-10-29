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
    <Toaster
      position="bottom-left"
      // Above the shortcuts bar, aligned with the work area (Figma frame 11).
      offset={{ bottom: '4.5rem', left: '1.5rem' }}
      toastOptions={{
        unstyled: true,
        // Figma "Producto eliminado / Deshacer": inverse bar with a bold action on the right.
        classNames: {
          toast:
            'flex w-full items-center justify-between gap-6 rounded-control bg-inverse px-4 py-3 text-sm text-on-primary shadow-modal',
          actionButton:
            'shrink-0 whitespace-nowrap rounded-control px-2 py-1 text-body font-semibold text-on-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus',
        },
      }}
    />
  </QueryClientProvider>
);

export default AppProviders;
