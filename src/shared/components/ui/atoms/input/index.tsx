import { cn } from '@shared/utils/cn';
import type { ComponentProps, ReactNode } from 'react';

export type InputSize = 'md' | 'lg';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /** `lg` (56 px, 18 px text) for the product code; `md` (44 px) for regular fields. */
  size?: InputSize;
  /** Error state: red border and `aria-invalid`. */
  invalid?: boolean;
  /** Content inside the right edge of the field (e.g. the "Mostrar" button). */
  endSlot?: ReactNode;
}

const sizes: Record<InputSize, string> = {
  md: 'min-h-target text-body',
  lg: 'min-h-control text-scan',
};

/** Text field of the design system (Figma: Input). */
export const Input = ({
  size = 'md',
  invalid = false,
  endSlot,
  className,
  ...props
}: InputProps) => (
  <div className="relative">
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-control border bg-surface px-4 text-ink placeholder:text-ink-subtle',
        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus',
        'disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-subtle',
        invalid ? 'border-danger' : 'border-border-strong',
        endSlot ? 'pr-28' : undefined,
        sizes[size],
        className,
      )}
      {...props}
    />
    {endSlot && <div className="absolute inset-y-0 right-1 flex items-center">{endSlot}</div>}
  </div>
);
