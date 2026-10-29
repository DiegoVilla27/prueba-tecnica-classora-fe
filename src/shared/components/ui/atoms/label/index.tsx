import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

/** Field label (Figma: Label). Always linked to its control with `htmlFor`. */
export const Label = ({ className, ...props }: ComponentProps<'label'>) => (
  // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- htmlFor comes in props
  <label className={cn('text-sm font-semibold text-ink', className)} {...props} />
);
