import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const aliases = {
  '@core': path.resolve(import.meta.dirname, './src/core'),
  '@features': path.resolve(import.meta.dirname, './src/features'),
  '@shared': path.resolve(import.meta.dirname, './src/shared'),
};

const sharedTestConfig = {
  globals: true, // describe, it, expect without importing them in every file
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
} as const;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler (stable Babel plugin): memoizes components and hooks automatically,
    // so the code never uses useMemo / useCallback / React.memo by hand.
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: aliases,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
  },
  test: {
    ...sharedTestConfig,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/schema/**',
        'src/**/dtos/**',
        'src/**/mocks/**',
        'src/core/environments/**',
        'src/core/mocks/**',
        'src/shared/test-utils/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    projects: [
      {
        resolve: { alias: aliases },
        test: {
          ...sharedTestConfig,
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['**/*.integration.*', 'node_modules', 'dist'],
        },
      },
      {
        resolve: { alias: aliases },
        test: {
          ...sharedTestConfig,
          name: 'integration',
          include: ['src/**/*.integration.test.{ts,tsx}'],
          exclude: ['node_modules', 'dist'],
        },
      },
    ],
  },
});
