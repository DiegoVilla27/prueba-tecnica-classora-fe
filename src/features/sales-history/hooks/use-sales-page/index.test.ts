/**
 * @fileoverview Unit tests for `useSalesPage` and `useSaleDetail`.
 */
import { MILK } from '@features/catalog/mocks/data';
import { seedClosedSale } from '@features/checkout/mocks/data';
import { createTestWrapper } from '@shared/test-utils/render';
import { renderHook, waitFor } from '@testing-library/react';
import useSalesPage from '.';
import useSaleDetail from '../use-sale-detail';

describe('Sales history: hooks', () => {
  it('should load a page of the history', async () => {
    // Arrange
    seedClosedSale([[MILK.code, 1]]);
    const { Wrapper } = createTestWrapper();

    // Act
    const { result } = renderHook(() => useSalesPage(0), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.data?.totalElements).toBe(1));
  });

  it('should load the detail only when a sale is selected', async () => {
    // Arrange
    const sale = seedClosedSale([[MILK.code, 3]]);
    const { Wrapper } = createTestWrapper();

    // Act
    const idle = renderHook(() => useSaleDetail(null), { wrapper: Wrapper });
    const selected = renderHook(() => useSaleDetail(sale.id), { wrapper: Wrapper });

    // Assert
    expect(idle.result.current.fetchStatus).toBe('idle');
    await waitFor(() => expect(selected.result.current.data?.total).toBe(285));
  });
});
