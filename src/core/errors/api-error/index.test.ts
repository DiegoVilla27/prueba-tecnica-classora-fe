/**
 * @fileoverview Unit tests for `ApiError`.
 * Verifies API error bodies and network failures are normalized.
 */
import { AxiosError, AxiosHeaders } from 'axios';
import { ApiError } from '.';

const axiosErrorWith = (status: number, data: unknown): AxiosError =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe('Core: ApiError', () => {
  it('should take status, message and field errors from the API error body', () => {
    // Arrange
    const error = axiosErrorWith(400, {
      status: 400,
      message: 'Validation failed',
      errors: [{ field: 'code', message: 'Code must contain 4 to 14 digits' }],
    });

    // Act
    const apiError = ApiError.from(error);

    // Assert
    expect(apiError.status).toBe(400);
    expect(apiError.message).toBe('Validation failed');
    expect(apiError.fieldErrors).toEqual([
      { field: 'code', message: 'Code must contain 4 to 14 digits' },
    ]);
    expect(apiError.isNetworkError).toBe(false);
  });

  it('should be a network error when there is no response', () => {
    // Arrange
    const error = new AxiosError('Network Error', 'ERR_NETWORK');

    // Act
    const apiError = ApiError.from(error);

    // Assert
    expect(apiError.status).toBeNull();
    expect(apiError.isNetworkError).toBe(true);
  });

  it('should return the same instance when it is already an ApiError', () => {
    // Arrange
    const original = new ApiError('Product not found.', 404);

    // Act
    const apiError = ApiError.from(original);

    // Assert
    expect(apiError).toBe(original);
  });
});
