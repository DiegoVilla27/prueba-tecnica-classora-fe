import interceptorErrors from '@core/interceptors/errors';
import interceptorJwtAuth from '@core/interceptors/jwt';
import AppProviders from '@core/providers';
import AppRoutes from '@core/router';
import { createRoot } from 'react-dom/client';
import './index.css';

// Order matters: the JWT interceptor needs the raw 401 before errors become ApiError.
interceptorJwtAuth();
interceptorErrors();

/**
 * Starts the MSW worker only in `pnpm local:mock`.
 *
 * @remarks
 * Reads `import.meta.env` directly (not `environment`) so Vite replaces it at build time and
 * drops the whole MSW chunk from the dev and prod bundles.
 */
const enableMocks = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;
  const { default: worker } = await import('@core/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

await enableMocks();

createRoot(rootElement).render(
  <AppProviders>
    <AppRoutes />
  </AppProviders>,
);
