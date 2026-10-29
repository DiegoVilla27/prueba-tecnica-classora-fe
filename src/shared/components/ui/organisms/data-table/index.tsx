import { cn } from '@shared/utils/cn';
import type { ComponentProps, ReactNode } from 'react';

type Align = 'left' | 'center' | 'right';

const aligns: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export interface DataTableProps extends ComponentProps<'table'> {
  /** Accessible title of the table, visually hidden. */
  caption: ReactNode;
}

/**
 * Semantic table of the design system (Figma: DataTable).
 *
 * @remarks
 * Real `<table>` with `<caption>` and `<th scope="col">` (CLAUDE.md §6): screen readers announce
 * the column of every amount. Compose it with `DataTableHead`, `DataTableRow`…
 */
export const DataTable = ({ caption, className, children, ...props }: DataTableProps) => (
  <table className={cn('w-full border-collapse', className)} {...props}>
    <caption className="sr-only">{caption}</caption>
    {children}
  </table>
);

export const DataTableHead = ({ className, ...props }: ComponentProps<'thead'>) => (
  <thead className={cn('bg-surface-muted', className)} {...props} />
);

export const DataTableBody = (props: ComponentProps<'tbody'>) => <tbody {...props} />;

export interface DataTableRowProps extends ComponentProps<'tr'> {
  /** Last scanned product (Figma: "ÚLTIMO AÑADIDO"). */
  isHighlighted?: boolean;
  /** Row chosen with ↑ / ↓. */
  isSelected?: boolean;
}

export const DataTableRow = ({
  isHighlighted = false,
  isSelected = false,
  className,
  ...props
}: DataTableRowProps) => (
  <tr
    aria-selected={isSelected || undefined}
    className={cn(
      'motion-safe:transition-colors motion-safe:duration-150',
      isHighlighted && 'bg-primary-subtle',
      isSelected && 'ring-3 ring-focus ring-inset',
      className,
    )}
    {...props}
  />
);

export interface DataTableHeaderCellProps extends ComponentProps<'th'> {
  align?: Align;
}

export const DataTableHeaderCell = ({
  align = 'left',
  className,
  ...props
}: DataTableHeaderCellProps) => (
  <th
    scope="col"
    className={cn(
      'px-4 py-3 text-overline font-semibold tracking-wide text-ink-muted uppercase',
      aligns[align],
      className,
    )}
    {...props}
  />
);

export interface DataTableCellProps extends ComponentProps<'td'> {
  align?: Align;
}

export const DataTableCell = ({ align = 'left', className, ...props }: DataTableCellProps) => (
  <td className={cn('px-4 py-3 align-middle', aligns[align], className)} {...props} />
);
