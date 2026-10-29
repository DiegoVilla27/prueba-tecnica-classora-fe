import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SaleLine } from '../models/sale-line';
import {
  canCompleteSale,
  itemCount,
  lineCount,
  saleTotal,
  type RemovedLine,
  type Sale,
} from '../models/sale';

/** Sale on screen + UI state (CLAUDE.md §3). The server is always the source of truth. */
export interface SaleState {
  /** Sale on screen: the server sale plus the optimistic changes still in flight. */
  sale: Sale | null;
  /**
   * Last sale confirmed by the server. Mutations resolve real line ids from it (optimistic
   * lines have temporary ids) and it is what a failed change goes back to.
   */
  serverSale: Sale | null;
  /** Code of the last scanned product: its row is highlighted and scrolled into view. */
  lastAddedCode: string | null;
  /** Row selected with the keyboard (↑ / ↓). */
  selectedLineId: string | null;
  /** Last removed line, kept so it can be undone (CU-03). */
  lastRemoved: RemovedLine | null;
}

export interface SaleActions {
  /** Loads a server sale on screen (initial load, new sale). */
  setSale: (sale: Sale | null) => void;
  /**
   * Stores a server response. It replaces the sale on screen only when `isLastInQueue`:
   * otherwise newer optimistic changes would flicker away until their own response.
   */
  confirmSale: (sale: Sale, isLastInQueue: boolean) => void;
  /** Applies an optimistic change computed by a pure function of `models/sale`. */
  applyOptimistic: (change: (sale: Sale) => Sale) => void;
  /** Undoes the optimistic changes after a failure: back to the last confirmed sale. */
  rollback: () => void;
  markAdded: (code: string | null) => void;
  selectLine: (lineId: string | null) => void;
  setLastRemoved: (removed: RemovedLine | null) => void;
  /** Back to the initial state (logout, tests). */
  reset: () => void;
}

export type SaleStore = SaleState & SaleActions;

export const initialSaleState: SaleState = {
  sale: null,
  serverSale: null,
  lastAddedCode: null,
  selectedLineId: null,
  lastRemoved: null,
};

/**
 * Store of the sale on screen (Zustand).
 *
 * @remarks
 * Business rules live in `models/sale`; the store only calls them and sets state. Components
 * read it with atomic selectors, never the whole store.
 */
const useSaleStore = create<SaleStore>()(
  devtools(
    (set) => ({
      ...initialSaleState,
      setSale: (sale) => set({ sale, serverSale: sale }, false, 'setSale'),
      confirmSale: (sale, isLastInQueue) =>
        set(
          isLastInQueue ? { sale, serverSale: sale } : { serverSale: sale },
          false,
          'confirmSale',
        ),
      applyOptimistic: (change) =>
        set(
          (state) => (state.sale ? { sale: change(state.sale) } : state),
          false,
          'applyOptimistic',
        ),
      rollback: () => set((state) => ({ sale: state.serverSale }), false, 'rollback'),
      markAdded: (code) => set({ lastAddedCode: code }, false, 'markAdded'),
      selectLine: (lineId) => set({ selectedLineId: lineId }, false, 'selectLine'),
      setLastRemoved: (removed) => set({ lastRemoved: removed }, false, 'setLastRemoved'),
      reset: () => set(initialSaleState, false, 'reset'),
    }),
    { name: 'sale', enabled: import.meta.env.DEV },
  ),
);

/** Stable empty list, so selecting the lines of a missing sale never re-renders in a loop. */
const NO_LINES: SaleLine[] = [];

export const selectSale = (state: SaleStore) => state.sale;
export const selectLines = (state: SaleStore) => state.sale?.lines ?? NO_LINES;
export const selectTotal = (state: SaleStore) => (state.sale ? saleTotal(state.sale) : 0);
export const selectItemCount = (state: SaleStore) => (state.sale ? itemCount(state.sale) : 0);
export const selectLineCount = (state: SaleStore) => (state.sale ? lineCount(state.sale) : 0);
export const selectCanComplete = (state: SaleStore) =>
  state.sale ? canCompleteSale(state.sale) : false;

export default useSaleStore;
