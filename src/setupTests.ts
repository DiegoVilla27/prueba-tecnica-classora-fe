import '@testing-library/jest-dom/vitest';
import server from '@shared/mocks/server';
import { cleanup } from '@testing-library/react';

// Any request without a handler fails the test: no real network in tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Clean the DOM and the per-test handlers (server.use) after each test.
afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => server.close());
