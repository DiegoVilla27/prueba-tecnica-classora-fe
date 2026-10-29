import { cn } from '@shared/utils/cn';
import { LoaderCircle } from 'lucide-react';

export interface SpinnerProps {
  /** Text announced to screen readers and shown next to the icon. */
  label: string;
  /** Hides the text visually (still announced). */
  hideLabel?: boolean;
  className?: string;
}

/** Loading indicator; `<output>` gives it the implicit `status` role (Figma: Spinner). */
export const Spinner = ({ label, hideLabel = false, className }: SpinnerProps) => (
  <output className={cn('flex items-center gap-2 text-sm text-ink-muted', className)}>
    <LoaderCircle aria-hidden="true" className="size-5 text-primary motion-safe:animate-spin" />
    <span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
  </output>
);
