/**
 * Typed access to the public `VITE_*` variables of the current mode (`.env.<mode>`).
 *
 * @remarks
 * Everything here ends up in the bundle: never put secrets in these variables.
 */
export const environment = {
  envName: import.meta.env.VITE_ENV_NAME,
  apiUrl: import.meta.env.VITE_API_URL,
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
} as const;
