/**
 * @fileoverview Unit tests for `useLineActions` (CU-02, CU-03).
 * Verifies + / −, removing at quantity 1 and undo.
 */
import { MILK } from '@features/catalog/mocks/data';
import { createTestWrapper } from '@shared/test-utils/render';
import { act, renderHook, waitFor } from '@testing-library/react';
import useLineActions from '.';
import { seedOpenSale } from '../../mocks/data';
import { toSale } from '../../services/mappers';
import useSaleStore, { initialSaleState } from '../../store';

const setup = (quantity: number) => {
  useSaleStore.setState(initialSaleState);
  useSaleStore.getState().setSale(toSale(seedOpenSale([[MILK.code, quantity]])));
  const { Wrapper } = createTestWrapper();
  const { result } = renderHook(() => useLineActions(), { wrapper: Wrapper });
  const line = () => useSaleStore.getState().sale?.lines[0];
  return { result, line };
};

describe('Checkout: useLineActions', () => {
  it('should increase and decrease a line', async () => {
    // Arrange
    const { result, line } = setup(2);

    // Act
    act(() => result.current.increase(line()!));
    await waitFor(() => expect(useSaleStore.getState().serverSale?.lines[0]?.quantity).toBe(3));
    act(() => result.current.decrease(line()!));

    // Assert
    await waitFor(() => expect(useSaleStore.getState().serverSale?.lines[0]?.quantity).toBe(2));
    expect(line()?.quantity).toBe(2);
  });

  it('should remove the line with − at 1 and bring it back with undo', async () => {
    // Arrange
    const { result, line } = setup(1);

    // Act
    act(() => result.current.decrease(line()!));
    await waitFor(() => expect(useSaleStore.getState().serverSale?.lines).toHaveLength(0));
    let undone = false;
    act(() => {
      undone = result.current.undo();
    });

    // Assert
    expect(undone).toBe(true);
    await waitFor(() => expect(useSaleStore.getState().serverSale?.lines).toHaveLength(1));
    expect(result.current.undo()).toBe(false);
  });
});
