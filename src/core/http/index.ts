import axiosInstance from '@core/axios';
import type { AxiosRequestConfig } from 'axios';

/**
 * Typed HTTP client over {@link axiosInstance} that unpacks `response.data`.
 *
 * @remarks
 * Services (`xxxSvc`) are the only callers: components and hooks never use it directly.
 * Errors arrive already normalized to `ApiError` by the errors interceptor.
 *
 * @example
 * ```ts
 * const product = await httpService.get<ProductResponseDto>(`/products/${code}`);
 * ```
 */
export const httpService = {
  /**
   * Performs a GET request.
   *
   * @typeParam T - Expected response body.
   * @param url - Path relative to the API base URL.
   * @param config - Extra Axios options.
   * @returns The response body.
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await axiosInstance.get<T>(url, config);
    return data;
  },

  /**
   * Performs a POST request.
   *
   * @typeParam T - Expected response body.
   * @typeParam D - Request body.
   * @param url - Path relative to the API base URL.
   * @param payload - Request body.
   * @param config - Extra Axios options.
   * @returns The response body.
   */
  post: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.post<T>(url, payload, config);
    return data;
  },

  /**
   * Performs a PATCH request.
   *
   * @typeParam T - Expected response body.
   * @typeParam D - Request body.
   * @param url - Path relative to the API base URL.
   * @param payload - Partial changes.
   * @param config - Extra Axios options.
   * @returns The response body.
   */
  patch: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.patch<T>(url, payload, config);
    return data;
  },

  /**
   * Performs a DELETE request.
   *
   * @typeParam T - Expected response body.
   * @param url - Path relative to the API base URL.
   * @param config - Extra Axios options.
   * @returns The response body.
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await axiosInstance.delete<T>(url, config);
    return data;
  },
};
