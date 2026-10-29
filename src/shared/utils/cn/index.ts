import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge only knows Tailwind's default scale. Our font sizes (`text-body`, `text-title`…,
 * docs/03-ux-ui.md §4.2) must be registered: otherwise `text-body` is taken for a color and
 * removes `text-on-primary` (white text on the primary button).
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['total', 'display', 'title', 'scan', 'body', 'overline'],
    },
  },
});

/**
 * Joins conditional class names and resolves Tailwind conflicts (the last one wins).
 *
 * @param inputs - Class names, arrays or `{ className: condition }` objects.
 * @returns A single class string without duplicated or conflicting utilities.
 *
 * @example
 * ```ts
 * cn('px-4', isActive && 'bg-primary', className);
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
