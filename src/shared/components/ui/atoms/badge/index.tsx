import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'danger';

export interface BadgeProps extends ComponentProps<'span'> {
  /** `success` (completed), `danger` (cancelled), `neutral` (open). The text always says it too. */
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'border-border bg-surface text-ink',
  success: 'border-primary bg-primary-subtle text-primary',
  danger: 'border-danger bg-surface text-danger',
};

/** Small status label: "Abierta", "Finalizada", "Cancelada" (Figma: Badge). */
export const Badge = ({ tone = 'neutral', className, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-control border px-3 py-1 text-xs font-medium whitespace-nowrap',
      tones[tone],
      className,
    )}
    {...props}
  />
);
