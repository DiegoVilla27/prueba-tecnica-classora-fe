import { cn } from '@shared/utils/cn';
import { formatMoney } from '@shared/utils/format-money';

export type MoneySize = 'md' | 'lg' | 'total';

export interface MoneyProps {
  /** Amount in **cents**. */
  cents: number;
  /** `md` unit price · `lg` line amount (semibold) · `total` sale total (56 px). */
  size?: MoneySize;
  className?: string;
}

const sizes: Record<MoneySize, string> = {
  md: 'text-body',
  lg: 'text-body font-semibold',
  total: 'text-[2.5rem] font-bold tracking-tight sm:text-total',
};

/** Euro amount with tabular figures, so columns of amounts line up (Figma: Money). */
export const Money = ({ cents, size = 'md', className }: MoneyProps) => (
  <span className={cn('whitespace-nowrap text-ink tabular-nums', sizes[size], className)}>
    {formatMoney(cents)}
  </span>
);
