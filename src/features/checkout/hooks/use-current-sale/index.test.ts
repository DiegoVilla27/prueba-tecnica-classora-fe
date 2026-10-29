/**
 * @fileoverview Unit tests for `useCurrentSale` (CU-08).
 * Verifies an open sale is recovered and a new one is opened when there is none.
 */
import { environment } from '@core/environments';
import { MILK } from '@features/catalog/mocks/data';
import server from '@shared/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestWrapper } from '@shared/test-utils/render';
import { renderHook, waitFor } from '@testing-library/react';
import useCurrentSale from '.';
import { seedOpenSale } from '../../mocks/data';
import useSaleStore, { initialSaleState } from '../../store';

describe('Checkout: useCurrentSale', () => {
  beforeEach(() => useSaleStore.setState(initialSaleState));

  it('should recover the open sale with its lines into the store', async () => {
    // Arrange
    const seeded = seedOpenSale([[MILK.code, 2]]);
    const { Wrapper } = createTestWrapper();

    // Act
    const { result } = renderHook(() => useCurrentSale(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(useSaleStore.getState().sale).toMatchObject({
      id: seeded.id,
      lines: [{ code: MILK.code, quantity: 2, unitPrice: 95 }],
    });
  });

  it('should open a new empty sale when there is none', async () => {
    // Arrange
    const { Wrapper } = createTestWrapper();

    // Act
    const { result } = renderHook(() => useCurrentSale(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(useSaleStore.getState().sale).toMatchObject({ status: 'OPEN', lines: [] });
    expect(result.current.isError).toBe(false);
  });
});

describe('Checkout: useCurrentSale errors', () => {
  it('should not retry a client error and expose it', async () => {
    // Arrange
    server.use(
      http.get(
        `${environment.apiUrl}/sales/current`,
        () => new HttpResponse(null, { status: 403 }),
      ),
    );
    const { Wrapper } = createTestWrapper();

    // Act
    const { result } = renderHook(() => useCurrentSale(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isConnecting).toBe(false);
    result.current.retry();
  });
});
