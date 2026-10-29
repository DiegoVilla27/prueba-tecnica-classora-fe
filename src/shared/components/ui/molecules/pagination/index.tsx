import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../atoms/button';

export interface PaginationProps {
  /** Zero-based current page. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Visible status, e.g. "Página 1 de 3 · 42 ventas". */
  label: string;
  previousLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
}

/** Previous / next page with a visible status (Figma: Pagination). */
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  label,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  disabled = false,
}: PaginationProps) => (
  // Phones: status on top and the two buttons below at equal width; from sm, one row.
  <nav
    aria-label={label}
    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
  >
    <p className="text-sm text-ink-muted">{label}</p>
    <div className="grid grid-cols-2 gap-2 sm:flex">
      <Button
        variant="secondary"
        disabled={disabled || page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        {previousLabel}
      </Button>
      <Button
        variant="secondary"
        disabled={disabled || page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        endSlot={<ChevronRight aria-hidden="true" className="size-4" />}
      >
        {nextLabel}
      </Button>
    </div>
  </nav>
);
