import handlersAuth from '@features/auth/mocks/handlers';
import handlersCatalog from '@features/catalog/mocks/handlers';
import handlersCheckout from '@features/checkout/mocks/handlers';
import type { RequestHandler } from 'msw';

/**
 * Every MSW handler of the app, aggregated from each feature's `mocks/handlers`.
 *
 * @remarks
 * Used by the browser worker (`pnpm local:mock`, e2e `mocked`) and by the Node server of the
 * tests.
 */
const handlers: RequestHandler[] = [...handlersAuth, ...handlersCatalog, ...handlersCheckout];

export default handlers;
