import { cn } from '@shared/utils/cn';

export interface AvatarProps {
  /** Up to two letters, e.g. "AL". */
  initials: string;
  className?: string;
}

/**
 * Round initials of a person (Figma: Avatar).
 *
 * @remarks
 * Decorative (`aria-hidden`): the name is always written next to it.
 */
export const Avatar = ({ initials, className }: AvatarProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'grid size-9 shrink-0 place-items-center rounded-full bg-primary-subtle text-sm font-semibold text-primary',
      className,
    )}
  >
    {initials}
  </span>
);
