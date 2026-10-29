import { Button, Card, EmptyState } from '@shared/components/ui';
import { CircleCheck } from 'lucide-react';
import { CHECKOUT_COPY, CHECKOUT_TEXT } from '../../../constants/messages';

export interface SaleCompletedProps {
  /** Total of the completed sale, in cents. */
  total: number;
  onNewSale: () => void;
  isStarting: boolean;
}

/**
 * Success after completing a sale (CU-04 step 4).
 *
 * @remarks
 * It waits for "Nueva venta" (Enter, focused) instead of disappearing on its own: the cashier
 * may still be telling the customer the total.
 */
export const SaleCompleted = ({ total, onNewSale, isStarting }: SaleCompletedProps) => (
  <Card as="section" padding="lg" aria-labelledby="sale-completed-title">
    <EmptyState
      icon={<CircleCheck className="size-6 text-primary" />}
      title={CHECKOUT_TEXT.completed(total)}
      action={
        <Button
          size="lg"
          // The only action of the view: Enter starts the next sale.
          // oxlint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          isLoading={isStarting}
          onClick={onNewSale}
        >
          {CHECKOUT_COPY.newSale}
        </Button>
      }
    />
    <h2 id="sale-completed-title" className="sr-only">
      {CHECKOUT_COPY.completedTitle}
    </h2>
  </Card>
);

export default SaleCompleted;
