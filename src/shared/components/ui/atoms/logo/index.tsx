import { cn } from '@shared/utils/cn';

export interface LogoProps {
  /** `onPrimary` inverts the mark for the green brand panel. */
  tone?: 'default' | 'onPrimary';
  className?: string;
}

/** Brand mark "classora / TPV" (Figma: Logo). */
export const Logo = ({ tone = 'default', className }: LogoProps) => (
  <p className={cn('flex items-center gap-3', className)}>
    <span
      aria-hidden="true"
      className={cn(
        'grid size-9 place-items-center rounded-control text-xl font-bold',
        tone === 'onPrimary' ? 'bg-surface text-primary' : 'bg-primary text-on-primary',
      )}
    >
      c
    </span>
    <span
      className={cn(
        'text-xl font-bold tracking-tight',
        tone === 'onPrimary' ? 'text-on-primary' : 'text-ink',
      )}
    >
      classora / TPV
    </span>
  </p>
);
