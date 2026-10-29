import useAnnouncer from '@shared/hooks/use-announcer';
import { toast } from 'sonner';
import { focusScanInput } from '../../constants/dom';
import { CHECKOUT_COPY, CHECKOUT_MESSAGES, CHECKOUT_TEXT } from '../../constants/messages';
import { LIMITS } from '../../constants/limits';
import type { SaleLine } from '../../models/sale-line';
import useSaleStore from '../../store';
import useSaleMutations from '../use-sale-mutations';

/** How long the "Deshacer" toast stays (CU-03). */
const UNDO_TOAST_MS = 5_000;

/**
 * Actions on the lines of the sale, shared by the table buttons and the keyboard (CU-02, CU-03).
 *
 * @remarks
 * Removing is never confirmed with a modal: it is frequent and reversible, so it shows a
 * "Deshacer" toast (and Ctrl+Z) instead. `−` at quantity 1 removes the line the same way.
 *
 * @returns `increase`, `decrease`, `remove` and `undo`.
 */
const useLineActions = () => {
  const { changeQuantity, removeProduct, undoRemove } = useSaleMutations();
  const announce = useAnnouncer();

  const setQuantity = (line: SaleLine, quantity: number) =>
    changeQuantity.mutate(
      { productId: line.productId, quantity },
      { onError: () => toast.error(CHECKOUT_MESSAGES.changeFailed) },
    );

  /** Undoes the last removal. Returns `false` when there is nothing to undo. */
  const undo = (): boolean => {
    const removed = useSaleStore.getState().lastRemoved;
    if (!removed) return false;
    undoRemove.mutate(removed, { onError: () => toast.error(CHECKOUT_MESSAGES.changeFailed) });
    toast.dismiss();
    announce(CHECKOUT_TEXT.added(removed.line.name, removed.line.quantity));
    return true;
  };

  const remove = (line: SaleLine) => {
    removeProduct.mutate(
      { productId: line.productId },
      { onError: () => toast.error(CHECKOUT_MESSAGES.removeFailed) },
    );
    toast(CHECKOUT_TEXT.removed(line.name), {
      duration: UNDO_TOAST_MS,
      action: { label: CHECKOUT_COPY.undo, onClick: undo },
    });
    announce(CHECKOUT_TEXT.removed(line.name));
    // The row is gone: the focus goes back to the code field (CLAUDE.md §6.3).
    focusScanInput();
  };

  const increase = (line: SaleLine) => {
    if (line.quantity < LIMITS.maxQuantity) setQuantity(line, line.quantity + 1);
  };

  const decrease = (line: SaleLine) =>
    line.quantity > LIMITS.minQuantity ? setQuantity(line, line.quantity - 1) : remove(line);

  return { increase, decrease, remove, undo };
};

export default useLineActions;
