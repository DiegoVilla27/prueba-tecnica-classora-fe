/**
 * @fileoverview Unit tests for the errors interceptor.
 * Verifies failed responses reach callers as `ApiError`.
 */
import axiosInstance from '@core/axios';
import { environment } from '@core/environments';
import { ApiError } from '@core/errors/api-error';
import server from '@shared/mocks/server';
import { http, HttpResponse } from 'msw';
import interceptorErrors from '.';

describe('Core: interceptorErrors', () => {
  beforeAll(() => interceptorErrors());
  afterAll(() => axiosInstance.interceptors.response.clear());

  it('should reject with an ApiError carrying the API status and message', async () => {
    // Arrange
    server.use(
      http.get(`${environment.apiUrl}/products/0000`, () =>
        HttpResponse.json(
          { status: 404, message: 'Product not found.', errors: [] },
          { status: 404 },
        ),
      ),
    );

    // Act
    const request = axiosInstance.get('/products/0000');

    // Assert
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ status: 404, message: 'Product not found.' });
  });
});
