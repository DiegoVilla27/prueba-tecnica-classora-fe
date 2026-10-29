/**
 * @fileoverview Unit tests for `useProductLookup`.
 * Verifies a rescanned code is served from the cache (CU-01 step 2, I-04).
 */
import { environment } from '@core/environments';
import server from '@shared/mocks/server';
import { createTestWrapper } from '@shared/test-utils/render';
import { renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import useProductLookup from '.';
import { MILK } from '../../mocks/data';

describe('Catalog: useProductLookup', () => {
  it('should fetch a product once and reuse it on the next scan', async () => {
    // Arrange
    let requests = 0;
    server.use(
      http.get(`${environment.apiUrl}/products/${MILK.code}`, () => {
        requests += 1;
        return HttpResponse.json(MILK);
      }),
    );
    const { Wrapper } = createTestWrapper();
    const { result } = renderHook(() => useProductLookup(), { wrapper: Wrapper });

    // Act
    const first = await result.current(MILK.code);
    const second = await result.current(MILK.code);

    // Assert
    expect(first).toEqual(second);
    expect(first.unitPrice).toBe(95);
    expect(requests).toBe(1);
  });
});
