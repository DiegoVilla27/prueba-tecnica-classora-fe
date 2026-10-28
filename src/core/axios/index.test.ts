/**
 * @fileoverview Unit tests for the Axios instance.
 * Verifies it points to the configured API with JSON headers and a timeout.
 */
import { environment } from '@core/environments';
import axiosInstance from '.';

describe('Core: axiosInstance', () => {
  it('should be configured with the API base URL, JSON and a timeout', () => {
    // Arrange
    const { defaults } = axiosInstance;

    // Act
    const contentType = defaults.headers['Content-Type'];

    // Assert
    expect(defaults.baseURL).toBe(environment.apiUrl);
    expect(defaults.timeout).toBe(10_000);
    expect(contentType).toBe('application/json');
  });
});
