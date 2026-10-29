import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

export interface OverlineProps extends ComponentProps<'p'> {
  /** `onPrimary` for the green brand panel. */
  tone?: 'default' | 'onPrimary';
}

/** Small upper-case section label: "TOTAL DE LA VENTA", "PUESTO DE CAJA" (Figma: Overline). */
export const Overline = ({ tone = 'default', className, ...props }: OverlineProps) => (
  <p
    className={cn(
      'text-overline font-semibold tracking-wide uppercase',
      tone === 'onPrimary' ? 'text-on-primary' : 'text-ink-muted',
      className,
    )}
    {...props}
  />
);
