import { Overline } from '../../atoms/overline';
import { cn } from '@shared/utils/cn';
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  /** Called on Esc and when the dialog is dismissed. The caller decides what closing means. */
  onClose: () => void;
  /** Small label above the title: "REVISAR VENTA". */
  overline?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /**
   * Buttons at the bottom (secondary first, main action last). Mark the one that must get the
   * focus with `data-autofocus` (React's `autoFocus` runs before `showModal()` and is lost).
   */
  actions: ReactNode;
  /** `destructive` is announced as an `alertdialog` (irreversible action). */
  variant?: 'default' | 'destructive';
  /** While an action runs ("Finalizando…") Esc does not close the dialog. */
  isBusy?: boolean;
}

/**
 * Modal dialog on the native `<dialog>` element (Figma: Modal).
 *
 * @remarks
 * `showModal()` gives real modality for free: the page behind becomes inert, focus stays in
 * the dialog and it sits on the top layer. Esc is handled here (not with the native `cancel`)
 * so it can be blocked while busy.
 */
export const Modal = ({
  isOpen,
  onClose,
  overline,
  title,
  description,
  children,
  actions,
  variant = 'default',
  isBusy = false,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first focusable element; honour the one the caller chose.
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (!isBusy) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      role={variant === 'destructive' ? 'alertdialog' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-busy={isBusy || undefined}
      onKeyDown={handleKeyDown}
      onCancel={(event) => event.preventDefault()}
      className={cn(
        'm-auto w-full max-w-lg rounded-modal bg-surface p-8 text-ink shadow-modal',
        'backdrop:bg-overlay',
      )}
    >
      {isOpen && (
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            {overline && <Overline>{overline}</Overline>}
            <h2 id={titleId} className="text-title font-bold">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="text-body text-ink-muted">
                {description}
              </div>
            )}
          </header>
          {children}
          <div className="mt-4 grid grid-cols-2 gap-4">{actions}</div>
        </div>
      )}
    </dialog>
  );
};
