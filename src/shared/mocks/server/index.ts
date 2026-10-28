import handlers from '@core/mocks/handlers';
import { setupServer } from 'msw/node';

/** MSW server for Vitest: the network of every test goes through these handlers. */
const server = setupServer(...handlers);

export default server;
