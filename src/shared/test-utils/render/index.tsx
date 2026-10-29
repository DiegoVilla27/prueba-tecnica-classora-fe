import interceptorErrors from '@core/interceptors/errors';
import interceptorJwtAuth from '@core/interceptors/jwt';
import { AppProviders, createQueryClient } from '@core/providers';
import { routes } from '@core/router/config';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';

/**
 * Renders the real route table at a given path, inside the app providers.
 *
 * @remarks
 * Integration tests use it to exercise guards, lazy screens and services together. The query
 * client has no retries so failures surface immediately.
 *
 * @param path - Initial URL, e.g. `/login?expired=1`.
 * @returns The RTL render result and the memory router (to assert navigation).
 */
export const renderRoute = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } });

  const result = render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );

  return { ...result, router };
};

/**
 * Registers the real interceptors (JWT, then errors) for integration tests.
 *
 * @param onSessionExpired - Replaces the redirect to `/login?expired=1` (jsdom cannot navigate).
 * @returns A function that removes both.
 */
export const registerInterceptors = (onSessionExpired: () => void = () => undefined) => {
  const ejectJwt = interceptorJwtAuth({ onSessionExpired });
  const ejectErrors = interceptorErrors();
  return () => {
    ejectErrors();
    ejectJwt();
  };
};

/**
 * Wrapper for `renderHook` / `render` of pieces that need the router and TanStack Query.
 *
 * @param initialPath - URL of the memory router.
 * @returns The wrapper component and its query client (to inspect the cache).
 */
export const createTestWrapper = (initialPath = '/') => {
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AppProviders queryClient={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    </AppProviders>
  );

  return { Wrapper, queryClient };
};
