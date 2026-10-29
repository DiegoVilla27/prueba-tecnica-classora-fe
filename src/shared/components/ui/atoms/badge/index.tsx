import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

/** Small status label: "Abierta" (Figma: Badge). */
export const Badge = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    className={cn(
      'inline-flex items-center rounded-control border border-border bg-surface px-3 py-1 text-xs font-medium text-ink',
      className,
    )}
    {...props}
  />
);
