import { useLogout } from '@features/auth';
import useAnnouncer from '@shared/hooks/use-announcer';
import useHotkeys from '@shared/hooks/use-hotkeys';
import { useState } from 'react';
import { focusScanInput } from '../../constants/dom';
import { CHECKOUT_MESSAGES, CHECKOUT_TEXT } from '../../constants/messages';
import useCurrentSale from '../../hooks/use-current-sale';
import useLineActions from '../../hooks/use-line-actions';
import useSaleMutations from '../../hooks/use-sale-mutations';
import useSaleStore, { selectCanComplete, selectLines, selectTotal } from '../../store';

type OpenModal = 'finalize' | 'clear' | 'logout' | null;

/**
 * Orchestrates the checkout screen: sale loading, modals, focus and keyboard (CU-04…CU-08).
 *
 * @returns Everything the screen needs to render and react.
 */
const useCheckoutScreen = () => {
  const currentSale = useCurrentSale();
  const { completeSale, startNewSale, cancelSale } = useSaleMutations();
  const { increase, decrease, remove, undo } = useLineActions();
  const logout = useLogout();
  const announce = useAnnouncer();

  const [openModal, setOpenModal] = useState<OpenModal>(null);
  /** Total of the sale just completed: shown above the new empty sale until the first scan. */
  const [completedTotal, setCompletedTotal] = useState<number | null>(null);
  const sale = useSaleStore((state) => state.sale);
  const lines = useSaleStore(selectLines);
  const total = useSaleStore(selectTotal);
  const canComplete = useSaleStore(selectCanComplete);
  const selectedLineId = useSaleStore((state) => state.selectedLineId);

  const isCompleted = sale?.status === 'COMPLETED';
  const isWorking = sale?.status === 'OPEN';
  const selectedLine = lines.find(({ id }) => id === selectedLineId);

  const closeModal = () => {
    setOpenModal(null);
    focusScanInput();
  };

  const openFinalize = () => {
    if (!canComplete) return;
    completeSale.reset();
    setOpenModal('finalize');
  };

  /**
   * CU-04: complete and go straight to a new empty sale (panel at 0, field focused). The total
   * just charged stays visible in a notice. If opening the new sale fails, the completed sale
   * stays on screen with its "Nueva venta" button as a fallback.
   */
  const confirmFinalize = () =>
    completeSale.mutate(undefined, {
      onSuccess: () => {
        setOpenModal(null);
        setCompletedTotal(total);
        announce(CHECKOUT_TEXT.completedNext(total));
        startNewSale.mutate(undefined, { onSuccess: focusScanInput });
      },
    });

  const openClear = () => {
    cancelSale.reset();
    setOpenModal('clear');
  };

  const confirmClear = () => cancelSale.mutate(undefined, { onSuccess: closeModal });

  const startNext = () => startNewSale.mutate(undefined, { onSuccess: focusScanInput });

  const endSession = () => {
    useSaleStore.getState().reset();
    logout();
  };

  /** CU-07: with products in the sale, confirm first (the sale stays open on the server). */
  const requestLogout = () => (lines.length > 0 ? setOpenModal('logout') : endSession());

  /** ↑ / ↓ through the rows (CU-06). */
  const moveSelection = (step: 1 | -1): boolean => {
    if (lines.length === 0) return false;
    const current = lines.findIndex(({ id }) => id === selectedLineId);
    const next =
      current === -1
        ? step === 1
          ? 0
          : lines.length - 1
        : Math.min(Math.max(current + step, 0), lines.length - 1);
    useSaleStore.getState().selectLine(lines[next]?.id ?? null);
    return true;
  };

  useHotkeys(
    [
      { combo: 'F12', allowInInputs: true, handler: openFinalize },
      { combo: 'ctrl+z', allowInInputs: true, handler: undo },
      { combo: 'ArrowDown', allowInInputs: true, handler: () => moveSelection(1) },
      { combo: 'ArrowUp', allowInInputs: true, handler: () => moveSelection(-1) },
      {
        combo: '+',
        allowInInputs: true,
        handler: () => (selectedLine ? increase(selectedLine) : false),
      },
      {
        combo: '-',
        allowInInputs: true,
        handler: () => (selectedLine ? decrease(selectedLine) : false),
      },
      {
        combo: 'Delete',
        allowInInputs: true,
        handler: () => (selectedLine ? remove(selectedLine) : false),
      },
      {
        combo: 'Escape',
        allowInInputs: true,
        handler: () => {
          if (!selectedLine) return false;
          useSaleStore.getState().selectLine(null);
          focusScanInput();
          return true;
        },
      },
    ],
    openModal === null && isWorking,
  );

  return {
    currentSale,
    isWorking,
    isCompleted,
    total,
    // The notice of the last completed sale stays until the first scan of the new one.
    completedTotal: isCompleted || lines.length === 0 ? completedTotal : null,
    openModal,
    closeModal,
    openFinalize,
    confirmFinalize,
    finalizeState: {
      isPending: completeSale.isPending,
      error: completeSale.isError ? CHECKOUT_MESSAGES.finalizeFailed : null,
    },
    openClear,
    confirmClear,
    clearState: {
      isPending: cancelSale.isPending,
      error: cancelSale.isError ? CHECKOUT_MESSAGES.clearFailed : null,
    },
    startNext,
    isStartingNext: startNewSale.isPending,
    requestLogout,
    endSession,
  };
};

export default useCheckoutScreen;
