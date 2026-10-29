import { Alert, Button, Modal } from '@shared/components/ui';
import { CHECKOUT_COPY, CHECKOUT_TEXT } from '../../../constants/messages';
import useSaleStore, { selectItemCount } from '../../../store';

export interface ClearSaleModalProps {
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Destructive confirmation to empty the sale (CU-05, Figma frame 16).
 *
 * @remarks
 * There is no undo, so it does ask. The focus starts on the safe option ("Volver a la venta").
 */
export const ClearSaleModal = ({
  isOpen,
  isPending,
  error,
  onClose,
  onConfirm,
}: ClearSaleModalProps) => {
  const items = useSaleStore(selectItemCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBusy={isPending}
      variant="destructive"
      overline={CHECKOUT_COPY.clearOverline}
      title={CHECKOUT_COPY.clearTitle}
      description={CHECKOUT_TEXT.clearDescription(items)}
      actions={
        <>
          <Button
            variant="secondary"
            size="lg"
            // Focused when the dialog opens (destructive: the safe option).
            data-autofocus
            disabled={isPending}
            onClick={onClose}
          >
            {CHECKOUT_COPY.back}
          </Button>
          <Button
            variant="danger"
            size="lg"
            isLoading={isPending}
            loadingText={CHECKOUT_COPY.clearing}
            onClick={onConfirm}
          >
            {CHECKOUT_COPY.clear}
          </Button>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
    </Modal>
  );
};

export default ClearSaleModal;
