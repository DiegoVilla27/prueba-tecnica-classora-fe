import {
  DataTableCell,
  DataTableRow,
  IconButton,
  Money,
  QuantityStepper,
} from '@shared/components/ui';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { CHECKOUT_COPY, CHECKOUT_TEXT } from '../../../constants/messages';
import { LIMITS } from '../../../constants/limits';
import { lineSubtotal, type SaleLine } from '../../../models/sale-line';
import { formatMoney } from '@shared/utils/format-money';

export interface SaleLineRowProps {
  line: SaleLine;
  /** Last scanned product: highlighted, labelled and scrolled into view. */
  isHighlighted: boolean;
  /** Row chosen with ↑ / ↓. */
  isSelected: boolean;
  onIncrease: (line: SaleLine) => void;
  onDecrease: (line: SaleLine) => void;
  onRemove: (line: SaleLine) => void;
}

/** One product of the ticket (Figma: SaleLineRow). */
export const SaleLineRow = ({
  line,
  isHighlighted,
  isSelected,
  onIncrease,
  onDecrease,
  onRemove,
}: SaleLineRowProps) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (!isHighlighted && !isSelected) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    rowRef.current?.scrollIntoView?.({
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    // line.quantity on purpose: rescanning the highlighted product must scroll to it again.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [isHighlighted, isSelected, line.quantity]);

  return (
    // Phones: product on top; stepper, amount and remove below. md and up: one table row.
    <DataTableRow
      ref={rowRef}
      isHighlighted={isHighlighted}
      isSelected={isSelected}
      className="flex flex-wrap items-center gap-y-2 border-b border-border px-1 py-3 last:border-b-0 sm:px-2 md:table-row md:border-0 md:p-0"
    >
      <DataTableCell className="basis-full px-2 py-0 md:px-4 md:py-3">
        <p className="text-body font-semibold text-ink">{line.name}</p>
        <p className="text-xs text-ink-muted">
          {line.code}
          {/* The unit price column is hidden on phones: it goes under the name instead. */}
          <span className="md:hidden"> · {formatMoney(line.unitPrice)} / ud</span>
          {isHighlighted && <span className="uppercase"> · {CHECKOUT_COPY.lastAdded}</span>}
        </p>
      </DataTableCell>
      <DataTableCell align="right" className="hidden md:table-cell">
        <Money cents={line.unitPrice} />
      </DataTableCell>
      <DataTableCell align="center" className="px-0 py-0 sm:px-2 md:px-4 md:py-3">
        <QuantityStepper
          value={line.quantity}
          max={LIMITS.maxQuantity}
          label={CHECKOUT_TEXT.quantityLabel(line.name)}
          decreaseLabel={CHECKOUT_TEXT.decreaseLabel(line.name)}
          increaseLabel={CHECKOUT_TEXT.increaseLabel(line.name)}
          onDecrease={() => onDecrease(line)}
          onIncrease={() => onIncrease(line)}
        />
      </DataTableCell>
      <DataTableCell align="right" className="ml-auto px-1 py-0 sm:px-2 md:ml-0 md:px-4 md:py-3">
        <Money cents={lineSubtotal(line)} size="lg" />
      </DataTableCell>
      <DataTableCell align="center" className="px-0 py-0 md:px-4 md:py-3">
        <IconButton
          variant="danger"
          aria-label={CHECKOUT_TEXT.removeLabel(line.name)}
          icon={<Trash2 className="size-5" />}
          onClick={() => onRemove(line)}
        />
      </DataTableCell>
    </DataTableRow>
  );
};

export default SaleLineRow;
