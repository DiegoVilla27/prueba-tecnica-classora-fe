import { AppProviders, createQueryClient } from '@core/providers';
import { routes } from '@core/router/config';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

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
