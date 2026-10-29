import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
/**
 * Against the real API every test signs in as the same cashier, who can only have one open
 * sale: those tests must run one at a time.
 */
const isFullStack = Boolean(process.env.E2E_FULL_STACK);

/**
 * Two projects (docs/05-testing.md §5):
 * - `mocked`: the app with the MSW worker (`pnpm local:mock`), deterministic, runs everywhere.
 * - `full-stack`: the app against the real API (`pnpm local` + backend on :8080).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: !isFullStack,
  workers: isFullStack ? 1 : undefined,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1366, height: 768 },
    locale: 'es-ES',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mocked',
      testDir: './e2e/mocked',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
    },
    {
      name: 'full-stack',
      testDir: './e2e/full-stack',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
    },
  ],
  webServer: {
    command: isFullStack ? 'pnpm local' : 'pnpm local:mock',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
