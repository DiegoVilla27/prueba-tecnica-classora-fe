import type { RequestHandler } from 'msw';

/**
 * Every MSW handler of the app, aggregated from each feature's `mocks/handlers`.
 *
 * @remarks
 * Used by the browser worker (`pnpm local:mock`, e2e `mocked`) and by the Node server of the
 * tests. Features add theirs here as they are built (auth, catalog, checkout).
 */
const handlers: RequestHandler[] = [];

export default handlers;
