import { Alert, Button, Modal, Money } from '@shared/components/ui';
import { CHECKOUT_COPY, CHECKOUT_TEXT } from '../../../constants/messages';
import useSaleStore, { selectItemCount, selectLineCount, selectTotal } from '../../../store';

export interface FinalizeSaleModalProps {
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Review before completing (CU-04, Figma frame 13).
 *
 * @remarks
 * The focus starts on "Finalizar venta" so Enter confirms; Esc goes back (except while sending).
 */
export const FinalizeSaleModal = ({
  isOpen,
  isPending,
  error,
  onClose,
  onConfirm,
}: FinalizeSaleModalProps) => {
  const total = useSaleStore(selectTotal);
  const items = useSaleStore(selectItemCount);
  const lines = useSaleStore(selectLineCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBusy={isPending}
      overline={CHECKOUT_COPY.finalizeOverline}
      title={CHECKOUT_COPY.finalizeTitle}
      description={CHECKOUT_TEXT.finalizeDescription(items, lines)}
      actions={
        <>
          <Button variant="secondary" size="lg" disabled={isPending} onClick={onClose}>
            {CHECKOUT_COPY.back}
          </Button>
          <Button
            size="lg"
            // Focused when the dialog opens (CU-04: Enter confirms).
            data-autofocus
            isLoading={isPending}
            loadingText={CHECKOUT_COPY.finalizing}
            onClick={onConfirm}
          >
            {CHECKOUT_COPY.finalize}
          </Button>
        </>
      }
    >
      <Money cents={total} size="total" />
      {error && <Alert>{error}</Alert>}
    </Modal>
  );
};

export default FinalizeSaleModal;
