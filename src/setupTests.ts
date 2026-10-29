import '@testing-library/jest-dom/vitest';
import { resetMockSales } from '@features/checkout/mocks/data';
import server from '@shared/mocks/server';
import { cleanup } from '@testing-library/react';

// axe-core probes <canvas>, which jsdom does not implement: answer "no context" quietly.
HTMLCanvasElement.prototype.getContext = () => null;

// Any request without a handler fails the test: no real network in tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Clean the DOM and the per-test handlers (server.use) after each test.
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockSales();
  localStorage.clear();
});

afterAll(() => server.close());
