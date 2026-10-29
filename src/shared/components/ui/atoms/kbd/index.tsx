import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

export type KbdTone = 'default' | 'plain' | 'onPrimary';

export interface KbdProps extends ComponentProps<'kbd'> {
  /**
   * `default` boxed key · `plain` bare text, as in the shortcuts bar of Figma ·
   * `onPrimary` inside a primary button ("Finalizar venta F12").
   */
  tone?: KbdTone;
}

const tones: Record<KbdTone, string> = {
  default: 'rounded border border-border bg-surface px-1.5 text-ink-muted',
  plain: 'text-ink-subtle',
  onPrimary: 'text-on-primary',
};

/** Keyboard key of a shortcut: F12, ⏎, Esc (Figma: Kbd). */
export const Kbd = ({ tone = 'default', className, ...props }: KbdProps) => (
  <kbd
    className={cn(
      'inline-flex items-center justify-center font-sans text-xs font-semibold',
      tones[tone],
      className,
    )}
    {...props}
  />
);
