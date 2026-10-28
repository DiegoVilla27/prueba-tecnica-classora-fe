import axiosInstance from '@core/axios';
import { environment } from '@core/environments';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';

/** Endpoints that must never trigger a refresh (they are the ones that issue tokens). */
const AUTH_PATHS = ['/auth/login', '/auth/refresh'];

interface RetriableRequest extends InternalAxiosRequestConfig {
  hasRetried?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtInterceptorOptions {
  /** What to do when the session cannot be renewed. Defaults to going to `/login?expired=1`. */
  onSessionExpired?: () => void;
}

const goToExpiredLogin = (): void => window.location.assign('/login?expired=1');

/** In-flight refresh shared by every request that got a 401 at the same time. */
let refreshInFlight: Promise<string> | null = null;

/**
 * Asks the API for a new token pair with the stored refresh token.
 *
 * @remarks
 * Uses a bare Axios call (not {@link axiosInstance}) so the request does not go through these
 * interceptors again.
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = StorageService.get<string>(STORAGE_KEYS.REFRESH);
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await axios.post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, {
    refreshToken,
  });
  StorageService.set(STORAGE_KEYS.TOKEN, data.accessToken);
  StorageService.set(STORAGE_KEYS.REFRESH, data.refreshToken);
  return data.accessToken;
};

const isAuthRequest = (config: InternalAxiosRequestConfig): boolean =>
  AUTH_PATHS.some((path) => config.url?.startsWith(path));

/**
 * Adds the `Bearer` token to every request and renews the session silently on a 401.
 *
 * @remarks
 * - Concurrent 401s share a single `POST /auth/refresh` and are retried once with the new token.
 * - If the refresh fails, the session is cleared and `onSessionExpired` runs.
 * - Must be registered before `interceptorErrors`, which converts errors to `ApiError`.
 *
 * @param options - Optional behaviour overrides (used by tests).
 * @returns A function that removes both interceptors.
 */
const interceptorJwtAuth = ({
  onSessionExpired = goToExpiredLogin,
}: JwtInterceptorOptions = {}): (() => void) => {
  const requestId = axiosInstance.interceptors.request.use((config) => {
    const token = StorageService.get<string>(STORAGE_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const responseId = axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) {
        throw error;
      }

      const request: RetriableRequest = error.config;
      if (isAuthRequest(request) || request.hasRetried) throw error;

      let token: string;
      try {
        refreshInFlight ??= refreshAccessToken().finally(() => {
          refreshInFlight = null;
        });
        token = await refreshInFlight;
      } catch {
        StorageService.clearSession();
        onSessionExpired();
        throw error;
      }

      // Only the refresh can end the session: a failing retry is a normal error.
      request.hasRetried = true;
      request.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(request);
    },
  );

  return () => {
    axiosInstance.interceptors.request.eject(requestId);
    axiosInstance.interceptors.response.eject(responseId);
  };
};

export default interceptorJwtAuth;
