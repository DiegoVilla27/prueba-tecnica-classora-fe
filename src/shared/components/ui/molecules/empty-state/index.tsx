import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /** Lucide icon, decorative. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Optional call to action under the text. */
  action?: ReactNode;
  className?: string;
}

/** Centred message when there is nothing to show: empty sale, completed sale (Figma: EmptyState). */
export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center gap-3 px-6 py-12 text-center', className)}>
    {icon && (
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-canvas text-ink-muted"
      >
        {icon}
      </span>
    )}
    <p className="text-body font-semibold text-ink">{title}</p>
    {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
    {action}
  </div>
);
