import type { ReactNode } from 'react';
import { ShortcutHint, type ShortcutHintProps } from '../../molecules/shortcut-hint';

export interface ShortcutsBarProps {
  /** Accessible name of the list: "Atajos de teclado". */
  label: string;
  shortcuts: Omit<ShortcutHintProps, 'className'>[];
  /** Text on the right: "Importes en euros". */
  trailing?: ReactNode;
}

/** Bottom cheat sheet of shortcuts: teaches the keyboard without documentation (Figma: ShortcutsBar). */
export const ShortcutsBar = ({ label, shortcuts, trailing }: ShortcutsBarProps) => (
  <div className="flex items-center justify-between gap-6 text-xs text-ink-subtle">
    <ul aria-label={label} className="flex flex-wrap items-center gap-5">
      {shortcuts.map((shortcut) => (
        <li key={shortcut.label}>
          <ShortcutHint {...shortcut} />
        </li>
      ))}
    </ul>
    {trailing && <p>{trailing}</p>}
  </div>
);
