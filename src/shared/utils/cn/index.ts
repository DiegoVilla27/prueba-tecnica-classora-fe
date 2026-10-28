import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
