import { cn } from '@shared/utils/cn';
import { Kbd } from '../../atoms/kbd';

export interface ShortcutHintProps {
  /** Keys as shown, e.g. `['Ctrl', 'Z']` or `['F12']`. */
  keys: string[];
  /** What the shortcut does: "Deshacer". */
  label: string;
  className?: string;
}

/** A shortcut and what it does: "F12 Finalizar" (Figma: ShortcutHint). */
export const ShortcutHint = ({ keys, label, className }: ShortcutHintProps) => (
  <span className={cn('inline-flex items-center gap-1.5 text-xs text-ink-subtle', className)}>
    <span className="inline-flex gap-1">
      {keys.map((key) => (
        <Kbd key={key} tone="plain">
          {key}
        </Kbd>
      ))}
    </span>
    {label}
  </span>
);
