import handlers from '@core/mocks/handlers';
import { setupWorker } from 'msw/browser';

/** Service worker that answers the API in the browser when `VITE_USE_MOCKS=true`. */
const worker = setupWorker(...handlers);

export default worker;
