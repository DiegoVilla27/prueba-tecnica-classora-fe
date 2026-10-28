import { isAxiosError } from 'axios';

/** A field-level validation error sent by the API (`errors[]`). */
export interface ApiFieldError {
  field: string;
  message: string;
}

/** Error body of the Java API (`ErrorResponseDTO`). */
export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  errors?: ApiFieldError[];
}

/**
 * Normalized error of any API call.
 *
 * @remarks
 * `status` is `null` when no response arrived (network down, timeout, CORS): the UI uses it
 * to tell "the product does not exist" (404) from "could not connect".
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly fieldErrors: ApiFieldError[];

  constructor(message: string, status: number | null, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /** `true` when the request never got an HTTP response. */
  get isNetworkError(): boolean {
    return this.status === null;
  }

  /**
   * Builds an `ApiError` from whatever an HTTP call threw.
   *
   * @param error - Usually an `AxiosError`; anything else becomes a network-less error.
   * @returns The normalized error.
   */
  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError<ApiErrorBody>(error)) {
      const body = error.response?.data;
      return new ApiError(
        body?.message ?? error.message,
        error.response?.status ?? null,
        body?.errors ?? [],
      );
    }

    return new ApiError(error instanceof Error ? error.message : 'Unexpected error', null);
  }
}
