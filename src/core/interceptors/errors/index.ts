import axiosInstance from '@core/axios';
import { ApiError } from '@core/errors/api-error';

/**
 * Normalizes every failed response to {@link ApiError}.
 *
 * @remarks
 * No global toasts: each screen decides how to show its errors (inline, toast, rollback).
 * Registered once in `main.tsx`, after the JWT interceptor so a refreshed retry is not
 * converted too early.
 *
 * @returns A function that removes the interceptor.
 */
const interceptorErrors = (): (() => void) => {
  const id = axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(ApiError.from(error)),
  );
  return () => axiosInstance.interceptors.response.eject(id);
};

export default interceptorErrors;
