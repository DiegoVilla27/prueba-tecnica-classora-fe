/**
 * @fileoverview Unit tests for `useSaleMutations` against the in-memory MSW sale.
 * Verifies optimistic updates, ordered requests, reconciliation and rollback.
 */
import { environment } from '@core/environments';
import { BAG, MILK } from '@features/catalog/mocks/data';
import server from '@shared/mocks/server';
import { createTestWrapper } from '@shared/test-utils/render';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import useSaleMutations from '.';
import { MaxQuantityExceededError } from '../../models/sale';
import { openSaleSvc } from '../../services';
import useSaleStore, { initialSaleState } from '../../store';

const milk = { id: MILK.id, code: MILK.code, name: MILK.name, unitPrice: 95 };
const bag = { id: BAG.id, code: BAG.code, name: BAG.name, unitPrice: 10 };

const setup = async () => {
  useSaleStore.getState().setSale(await openSaleSvc());
  const { Wrapper } = createTestWrapper();
  return renderHook(() => useSaleMutations(), { wrapper: Wrapper }).result;
};

const codesOnScreen = () => useSaleStore.getState().sale?.lines.map((line) => line.code);

describe('Checkout: useSaleMutations', () => {
  beforeEach(() => useSaleStore.setState(initialSaleState));

  it('should show a scan at once and reconcile it with the server line', async () => {
    // Arrange
    const result = await setup();

    // Act
    act(() => result.current.addProduct.mutate({ product: milk, quantity: 1 }));
    const optimistic = useSaleStore.getState().sale?.lines[0];

    // Assert
    expect(optimistic).toMatchObject({ code: MILK.code, id: `optimistic-${MILK.id}` });
    expect(useSaleStore.getState().lastAddedCode).toBe(MILK.code);
    await waitFor(() =>
      expect(useSaleStore.getState().sale?.lines[0]?.id).not.toMatch(/^optimistic/),
    );
  });

  it('should keep fast actions in order: scan twice and change quantity before any response', async () => {
    // Arrange
    const result = await setup();

    // Act
    act(() => {
      result.current.addProduct.mutate({ product: milk, quantity: 1 });
      result.current.addProduct.mutate({ product: bag, quantity: 1 });
      result.current.changeQuantity.mutate({ productId: MILK.id, quantity: 5 });
    });

    // Assert
    expect(codesOnScreen()).toEqual([MILK.code, BAG.code]);
    await waitFor(() => expect(result.current.changeQuantity.isSuccess).toBe(true));
    expect(useSaleStore.getState().sale?.lines.map((line) => line.quantity)).toEqual([5, 1]);
    expect(useSaleStore.getState().serverSale).toEqual(useSaleStore.getState().sale);
  });

  it('should refuse to pass 999 units without sending a request', async () => {
    // Arrange
    const result = await setup();
    await act(() => result.current.addProduct.mutateAsync({ product: milk, quantity: 998 }));
    let requests = 0;
    server.events.on('request:start', () => {
      requests += 1;
    });

    // Act
    const attempt = act(() =>
      result.current.addProduct.mutateAsync({ product: milk, quantity: 2 }),
    );

    // Assert
    await expect(attempt).rejects.toBeInstanceOf(MaxQuantityExceededError);
    expect(requests).toBe(0);
    expect(useSaleStore.getState().sale?.lines[0]?.quantity).toBe(998);
    server.events.removeAllListeners();
  });

  it('should roll back an optimistic scan when the server fails', async () => {
    // Arrange
    const result = await setup();
    server.use(
      http.post(
        `${environment.apiUrl}/sales/:id/lines`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    // Act
    await act(async () => {
      await result.current.addProduct
        .mutateAsync({ product: milk, quantity: 1 })
        .catch(() => undefined);
    });

    // Assert
    expect(useSaleStore.getState().sale?.lines).toEqual([]);
  });

  it('should remove a line and bring it back with undo', async () => {
    // Arrange
    const result = await setup();
    await act(() => result.current.addProduct.mutateAsync({ product: milk, quantity: 3 }));
    await act(() => result.current.addProduct.mutateAsync({ product: bag, quantity: 1 }));

    // Act
    await act(() => result.current.removeProduct.mutateAsync({ productId: MILK.id }));
    const afterRemove = codesOnScreen();
    const removed = useSaleStore.getState().lastRemoved!;
    await act(() => result.current.undoRemove.mutateAsync(removed));

    // Assert
    expect(afterRemove).toEqual([BAG.code]);
    expect(useSaleStore.getState().sale?.lines).toEqual([
      expect.objectContaining({ code: BAG.code }),
      expect.objectContaining({ code: MILK.code, quantity: 3 }),
    ]);
    expect(useSaleStore.getState().lastRemoved).toBeNull();
  });

  it('should complete the sale and then start a new empty one', async () => {
    // Arrange
    const result = await setup();
    await act(() => result.current.addProduct.mutateAsync({ product: milk, quantity: 1 }));

    // Act
    const completed = await act(() => result.current.completeSale.mutateAsync());
    await act(() => result.current.startNewSale.mutateAsync());

    // Assert
    expect(completed.status).toBe('COMPLETED');
    expect(useSaleStore.getState().sale).toMatchObject({ status: 'OPEN', lines: [] });
  });

  it('should cancel the sale and leave a new empty one on screen', async () => {
    // Arrange
    const result = await setup();
    await act(() => result.current.addProduct.mutateAsync({ product: milk, quantity: 2 }));
    const cancelledId = useSaleStore.getState().sale?.id;

    // Act
    await act(() => result.current.cancelSale.mutateAsync());

    // Assert
    const sale = useSaleStore.getState().sale;
    expect(sale).toMatchObject({ status: 'OPEN', lines: [] });
    expect(sale?.id).not.toBe(cancelledId);
    expect(useSaleStore.getState().lastAddedCode).toBeNull();
  });
});
