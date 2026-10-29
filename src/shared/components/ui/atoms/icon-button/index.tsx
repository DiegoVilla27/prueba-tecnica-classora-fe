import { cn } from '@shared/utils/cn';
import type { ComponentProps, ReactNode } from 'react';

export type IconButtonVariant = 'neutral' | 'danger' | 'outline';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** Required: an icon has no text, this is its accessible name ("Eliminar Leche entera 1L"). */
  'aria-label': string;
  /** Lucide icon (decorative: it is marked `aria-hidden` by the caller or here). */
  icon: ReactNode;
  /** `neutral` (row actions), `danger` (turns red on hover), `outline` (stepper − / +). */
  variant?: IconButtonVariant;
}

const variants: Record<IconButtonVariant, string> = {
  neutral: 'text-ink-muted hover:bg-canvas hover:text-ink',
  danger: 'text-ink-muted hover:bg-canvas hover:text-danger',
  outline: 'border border-border-strong bg-surface text-ink hover:bg-canvas',
};

/** Square 44 × 44 button with only an icon (Figma: IconButton). */
export const IconButton = ({
  icon,
  variant = 'neutral',
  type = 'button',
  className,
  ...props
}: IconButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-grid size-target place-items-center rounded-control',
      'motion-safe:transition-colors motion-safe:duration-150',
      'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus',
      'disabled:cursor-not-allowed disabled:opacity-40',
      variants[variant],
      className,
    )}
    {...props}
  >
    <span aria-hidden="true" className="contents">
      {icon}
    </span>
  </button>
);
