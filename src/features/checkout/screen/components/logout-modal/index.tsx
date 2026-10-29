import { Button, Modal } from '@shared/components/ui';
import { CHECKOUT_COPY } from '../../../constants/messages';

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Leaving with products in the sale (CU-07, Figma frame 17): the sale stays open. */
export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    overline={CHECKOUT_COPY.logoutOverline}
    title={CHECKOUT_COPY.logoutTitle}
    description={CHECKOUT_COPY.logoutDescription}
    actions={
      <>
        <Button
          variant="secondary"
          size="lg"
          // Focused when the dialog opens (the option that keeps working).
          data-autofocus
          onClick={onClose}
        >
          {CHECKOUT_COPY.back}
        </Button>
        <Button size="lg" onClick={onConfirm}>
          {CHECKOUT_COPY.logoutConfirm}
        </Button>
      </>
    }
  />
);

export default LogoutModal;
