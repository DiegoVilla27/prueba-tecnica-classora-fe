import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

export interface KeyValueProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}

/** Label on the left, value on the right: "Estado · En curso" (Figma: KeyValue). */
export const KeyValue = ({ label, value, className }: KeyValueProps) => (
  <dl className={cn('flex items-baseline justify-between gap-4 text-sm', className)}>
    <dt className="text-ink-muted">{label}</dt>
    <dd className="text-ink-muted">{value}</dd>
  </dl>
);
