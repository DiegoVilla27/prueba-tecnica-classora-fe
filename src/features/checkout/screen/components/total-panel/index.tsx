import { Button, Card, Kbd, KeyValue, Money, Overline } from '@shared/components/ui';
import { useId } from 'react';
import { CHECKOUT_COPY, CHECKOUT_TEXT } from '../../../constants/messages';
import useSaleStore, {
  selectCanComplete,
  selectItemCount,
  selectLineCount,
  selectTotal,
} from '../../../store';

export interface TotalPanelProps {
  onFinalize: () => void;
  onClear: () => void;
}

/** Payment panel: total, summary and the sale actions (Figma: TotalPanel). */
export const TotalPanel = ({ onFinalize, onClear }: TotalPanelProps) => {
  const total = useSaleStore(selectTotal);
  const items = useSaleStore(selectItemCount);
  const lines = useSaleStore(selectLineCount);
  const canComplete = useSaleStore(selectCanComplete);
  const titleId = useId();
  const hintId = useId();

  return (
    // Full height of the side panel: the actions sit at the bottom, as in the Figma frames.
    <Card
      as="section"
      padding="lg"
      aria-labelledby={titleId}
      className="flex h-full flex-col gap-4"
    >
      <Overline id={titleId}>{CHECKOUT_COPY.totalTitle}</Overline>
      <Money cents={total} size="total" />
      <p className="text-body text-ink-muted">{CHECKOUT_TEXT.summary(items, lines)}</p>
      <KeyValue
        className="border-t border-border pt-4"
        label={CHECKOUT_COPY.stateLabel}
        value={CHECKOUT_COPY.stateValue}
      />
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          size="lg"
          disabled={!canComplete}
          aria-describedby={canComplete ? undefined : hintId}
          // The shortcut is declared for assistive tech; the visible key stays out of the name.
          aria-keyshortcuts="F12"
          onClick={onFinalize}
          endSlot={
            <Kbd tone="onPrimary" aria-hidden="true">
              F12
            </Kbd>
          }
        >
          {CHECKOUT_COPY.finalize}
        </Button>
        {!canComplete && (
          <p id={hintId} className="text-center text-xs text-ink-muted">
            {CHECKOUT_COPY.finalizeDisabledHint}
          </p>
        )}
        <Button variant="ghost" size="lg" disabled={lines === 0} onClick={onClear}>
          {CHECKOUT_COPY.clear}
        </Button>
      </div>
    </Card>
  );
};

export default TotalPanel;
