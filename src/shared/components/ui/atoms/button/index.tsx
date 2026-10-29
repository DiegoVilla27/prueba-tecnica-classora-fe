import { cn } from '@shared/utils/cn';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends ComponentProps<'button'> {
  /** Visual intent. `primary` is the main action of the view; `danger` is destructive. */
  variant?: ButtonVariant;
  /** `lg` (56 px) for the main checkout actions; `md` (44 px) elsewhere. */
  size?: ButtonSize;
  /** Shows a spinner, disables the button and sets `aria-busy`. */
  isLoading?: boolean;
  /** Text shown while loading (e.g. "Finalizando…"); defaults to the children. */
  loadingText?: ReactNode;
  /** Content after the label: an icon or a `Kbd` shortcut. */
  endSlot?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-border-strong bg-surface text-ink hover:bg-canvas',
  danger: 'bg-danger text-on-primary hover:bg-danger-hover',
  ghost: 'bg-transparent text-ink-muted hover:bg-canvas hover:text-ink',
};

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-target px-4 text-sm',
  lg: 'min-h-control px-6 text-body',
};

/**
 * Button of the design system (Figma: Button).
 *
 * @remarks
 * `type="button"` by default so it never submits a form by accident; pass `type="submit"`
 * explicitly in forms.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  endSlot,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-control font-semibold',
      'motion-safe:transition-colors motion-safe:duration-150',
      'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {isLoading && <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />}
    <span>{isLoading && loadingText ? loadingText : children}</span>
    {!isLoading && endSlot}
  </button>
);
