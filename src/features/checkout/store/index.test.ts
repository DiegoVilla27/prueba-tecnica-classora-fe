/**
 * @fileoverview Unit tests for `useSaleStore`.
 * Verifies optimistic changes, rollback, UI state and derived selectors.
 */
import type { Product } from '@features/catalog';
import useSaleStore, {
  initialSaleState,
  selectCanComplete,
  selectItemCount,
  selectLineCount,
  selectLines,
  selectTotal,
} from '.';
import { addProductToSale, type Sale } from '../models/sale';

const milk: Product = {
  id: 'p-milk',
  code: '8412345000010',
  name: 'Leche entera 1L',
  unitPrice: 95,
};
const openSale: Sale = { id: 'sale-1', status: 'OPEN', version: 0, lines: [] };

describe('Checkout: useSaleStore', () => {
  beforeEach(() => useSaleStore.setState(initialSaleState));

  it('should apply an optimistic change and expose the derived totals', () => {
    // Arrange
    useSaleStore.getState().setSale(openSale);

    // Act
    useSaleStore.getState().applyOptimistic((sale) => addProductToSale(sale, milk, 3));

    // Assert
    const state = useSaleStore.getState();
    expect(selectLines(state)).toHaveLength(1);
    expect(selectTotal(state)).toBe(285);
    expect(selectItemCount(state)).toBe(3);
    expect(selectLineCount(state)).toBe(1);
    expect(selectCanComplete(state)).toBe(true);
  });

  it('should roll back to the last confirmed sale after a failed change', () => {
    // Arrange
    useSaleStore.getState().setSale(openSale);
    useSaleStore.getState().applyOptimistic((sale) => addProductToSale(sale, milk));

    // Act
    useSaleStore.getState().rollback();

    // Assert
    expect(useSaleStore.getState().sale).toBe(openSale);
  });

  it('should only show a confirmed sale when it is the last response in the queue', () => {
    // Arrange
    useSaleStore.getState().setSale(openSale);
    useSaleStore.getState().applyOptimistic((sale) => addProductToSale(sale, milk, 2));
    const onScreen = useSaleStore.getState().sale;
    const confirmed: Sale = { ...openSale, version: 1 };

    // Act
    useSaleStore.getState().confirmSale(confirmed, false);
    const whileQueued = useSaleStore.getState();
    useSaleStore.getState().confirmSale(confirmed, true);

    // Assert
    expect(whileQueued.sale).toBe(onScreen);
    expect(whileQueued.serverSale).toBe(confirmed);
    expect(useSaleStore.getState().sale).toBe(confirmed);
  });

  it('should keep the UI state and clear everything on reset', () => {
    // Arrange
    const store = useSaleStore.getState();
    store.setSale(openSale);
    store.markAdded(milk.code);
    store.selectLine('line-1');

    // Act
    const beforeReset = { ...useSaleStore.getState() };
    useSaleStore.getState().reset();

    // Assert
    expect(beforeReset).toMatchObject({ lastAddedCode: milk.code, selectedLineId: 'line-1' });
    expect(useSaleStore.getState()).toMatchObject(initialSaleState);
  });

  it('should return safe defaults while there is no sale', () => {
    // Arrange
    const state = useSaleStore.getState();

    // Act
    const derived = [selectTotal(state), selectItemCount(state), selectCanComplete(state)];

    // Assert
    expect(derived).toEqual([0, 0, false]);
    expect(selectLines(state)).toBe(selectLines(state));
  });
});
