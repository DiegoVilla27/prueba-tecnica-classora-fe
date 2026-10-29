import type { Product } from '@features/catalog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addProductToSale,
  changeLineQuantity,
  removeLine,
  restoreLine,
  type RemovedLine,
  type Sale,
} from '../../models/sale';
import {
  addLineSvc,
  cancelSaleSvc,
  completeSaleSvc,
  openSaleSvc,
  removeLineSvc,
  updateLineSvc,
} from '../../services';
import useSaleStore from '../../store';

/** Every sale mutation shares this key (to count them) and this scope (to run them in order). */
export const SALE_MUTATION_KEY = ['sale'] as const;
const SALE_SCOPE = { id: 'sale' };

const store = () => useSaleStore.getState();

/** Id of the confirmed sale: requests only run once the previous ones have answered. */
const confirmedSaleId = (): string => {
  const sale = store().serverSale;
  if (!sale) throw new Error('There is no open sale.');
  return sale.id;
};

/**
 * Real id of a product's line in the confirmed sale. Optimistic lines carry a temporary id,
 * so screens identify lines by product and the id is resolved when the request runs.
 */
const confirmedLineId = (productId: string): string => {
  const line = store().serverSale?.lines.find((candidate) => candidate.productId === productId);
  if (!line) throw new Error(`Product ${productId} is not in the sale.`);
  return line.id;
};

const lineIdOnScreen = (sale: Sale, productId: string): string => {
  const line = sale.lines.find((candidate) => candidate.productId === productId);
  if (!line) throw new Error(`Product ${productId} is not in the sale.`);
  return line.id;
};

/**
 * Cashier actions on the sale (CU-01…CU-05) as TanStack Query mutations.
 *
 * @remarks
 * - All share `scope: 'sale'`: requests run one after another in the order of the actions,
 *   so fast scans are never lost or reordered (CU-01 A7).
 * - Scan, quantity, remove and undo are **optimistic**: `onMutate` updates the screen at once
 *   with the pure functions of `models/sale`; the server response reconciles it and a failure
 *   rolls back to the last confirmed sale.
 * - Complete and cancel are **not** optimistic: they are irreversible, the screen waits.
 *
 * @returns One mutation per action; screens call `mutate` / `mutateAsync` and show the errors.
 */
const useSaleMutations = () => {
  const queryClient = useQueryClient();

  /** Only the last queued response replaces the screen (see `confirmSale`). */
  const confirm = (sale: Sale) =>
    store().confirmSale(sale, queryClient.isMutating({ mutationKey: SALE_MUTATION_KEY }) <= 1);
  const rollback = () => store().rollback();
  const optimistic = {
    mutationKey: SALE_MUTATION_KEY,
    scope: SALE_SCOPE,
    onSuccess: confirm,
    onError: rollback,
  };

  const addProduct = useMutation({
    ...optimistic,
    mutationFn: ({ product, quantity }: { product: Product; quantity: number }) =>
      addLineSvc(confirmedSaleId(), { code: product.code, quantity }),
    onMutate: ({ product, quantity }) => {
      // Throws MaxQuantityExceededError before any request when the line would pass 999.
      store().applyOptimistic((sale) => addProductToSale(sale, product, quantity));
      store().markAdded(product.code);
    },
  });

  const changeQuantity = useMutation({
    ...optimistic,
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateLineSvc(confirmedSaleId(), confirmedLineId(productId), { quantity }),
    onMutate: ({ productId, quantity }) => {
      store().applyOptimistic((sale) =>
        changeLineQuantity(sale, lineIdOnScreen(sale, productId), quantity),
      );
    },
  });

  const removeProduct = useMutation({
    ...optimistic,
    mutationFn: ({ productId }: { productId: string }) =>
      removeLineSvc(confirmedSaleId(), confirmedLineId(productId)),
    onMutate: ({ productId }) => {
      let removedLine: RemovedLine | null = null;
      store().applyOptimistic((sale) => {
        const { sale: next, removed } = removeLine(sale, lineIdOnScreen(sale, productId));
        removedLine = removed;
        return next;
      });
      store().setLastRemoved(removedLine);
      store().selectLine(null);
    },
  });

  const undoRemove = useMutation({
    ...optimistic,
    mutationFn: ({ line }: RemovedLine) =>
      addLineSvc(confirmedSaleId(), { code: line.code, quantity: line.quantity }),
    onMutate: (removed) => {
      store().applyOptimistic((sale) => restoreLine(sale, removed));
      store().setLastRemoved(null);
    },
  });

  const completeSale = useMutation({
    mutationKey: SALE_MUTATION_KEY,
    scope: SALE_SCOPE,
    mutationFn: () => completeSaleSvc(confirmedSaleId()),
    onSuccess: (sale) => store().setSale(sale),
  });

  /** Opens the next sale after a completed one (CU-04 step 4). */
  const startNewSale = useMutation({
    mutationKey: SALE_MUTATION_KEY,
    scope: SALE_SCOPE,
    mutationFn: openSaleSvc,
    onSuccess: (sale) => {
      store().reset();
      store().setSale(sale);
    },
  });

  /** Cancels the sale and opens a new empty one (CU-05). */
  const cancelSale = useMutation({
    mutationKey: SALE_MUTATION_KEY,
    scope: SALE_SCOPE,
    mutationFn: async () => {
      await cancelSaleSvc(confirmedSaleId());
      return openSaleSvc();
    },
    onSuccess: (sale) => {
      store().reset();
      store().setSale(sale);
    },
  });

  return {
    addProduct,
    changeQuantity,
    removeProduct,
    undoRemove,
    completeSale,
    startNewSale,
    cancelSale,
  };
};

export default useSaleMutations;
