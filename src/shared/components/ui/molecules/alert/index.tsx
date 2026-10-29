import { cn } from '@shared/utils/cn';
import { CircleAlert, Info } from 'lucide-react';
import type { ReactNode } from 'react';

export type AlertVariant = 'error' | 'info';

export interface AlertProps {
  /** `error` is announced at once (`role="alert"`); `info` politely (`role="status"`). */
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<AlertVariant, string> = {
  error: 'border-danger bg-surface text-danger',
  info: 'border-primary bg-primary-subtle text-ink',
};

/** Inline message with icon + text (Figma: Alert). */
export const Alert = ({ variant = 'error', children, className }: AlertProps) => {
  const Icon = variant === 'error' ? CircleAlert : Info;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-control border px-4 py-3 text-sm',
        variants[variant],
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
};
