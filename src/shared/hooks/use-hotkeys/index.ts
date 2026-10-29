import { useEffect, useEffectEvent } from 'react';

/** A keyboard shortcut. `combo` is case-insensitive: `'F12'`, `'Escape'`, `'ctrl+z'`, `'+'`. */
export interface Hotkey {
  combo: string;
  handler: (event: KeyboardEvent) => void;
  /**
   * Also fire while typing in a field. `false` by default so `+`, `-` or `Delete` never steal
   * keystrokes from an input; `F12`, `Escape` and `ctrl+z` usually set it to `true`.
   */
  allowInInputs?: boolean;
}

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** `ctrl` also matches ⌘ on macOS. */
const matches = (event: KeyboardEvent, combo: string): boolean => {
  const parts = combo.toLowerCase().split('+');
  // A bare "+" splits into ['', '']: the key itself is "+".
  const key = combo === '+' ? '+' : (parts.at(-1) ?? '');
  const wantsCtrl = parts.includes('ctrl');
  const hasCtrl = event.ctrlKey || event.metaKey;
  return event.key.toLowerCase() === key && wantsCtrl === hasCtrl;
};

/**
 * Registers global keyboard shortcuts on `window` (CU-06).
 *
 * @remarks
 * The listener is attached once; `useEffectEvent` always calls the latest handlers, so callers
 * can pass a new array on every render. A matched shortcut prevents the browser default
 * (e.g. F12 devtools, Ctrl+Z on the page).
 *
 * @param hotkeys - Shortcuts to listen to.
 * @param enabled - Turns all of them off (e.g. while a modal handles its own keys).
 */
const useHotkeys = (hotkeys: Hotkey[], enabled = true): void => {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!enabled) return;
    const hotkey = hotkeys.find(({ combo }) => matches(event, combo));
    if (!hotkey) return;
    if (isTypingTarget(event.target) && !hotkey.allowInInputs) return;
    event.preventDefault();
    hotkey.handler(event);
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
};

export default useHotkeys;
