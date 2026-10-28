/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Environment label: `local`, `mock`, `dev` or `prod`. */
  readonly VITE_ENV_NAME: string;
  /** Base URL of the Java API, including `/api/v1`. */
  readonly VITE_API_URL: string;
  /** `'true'` to answer every request with MSW in the browser (no backend). */
  readonly VITE_USE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
