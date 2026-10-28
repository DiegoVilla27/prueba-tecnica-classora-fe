import axiosInstance from '@core/axios';
import { ApiError } from '@core/errors/api-error';

/**
 * Normalizes every failed response to {@link ApiError}.
 *
 * @remarks
 * No global toasts: each screen decides how to show its errors (inline, toast, rollback).
 * Registered once in `main.tsx`, after the JWT interceptor so a refreshed retry is not
 * converted too early.
 */
const interceptorErrors = (): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(ApiError.from(error)),
  );
};

export default interceptorErrors;
