const REGION_ID = 'app-announcer';

/** Creates (once) the visually hidden polite live region shared by the whole app. */
const getRegion = (): HTMLElement => {
  const existing = document.getElementById(REGION_ID);
  if (existing) return existing;

  const region = document.createElement('div');
  region.id = REGION_ID;
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.append(region);
  return region;
};

/**
 * Announces messages to screen readers: "Leche entera 1L añadida. Cantidad 2" (CLAUDE.md §6.4).
 *
 * @remarks
 * One `aria-live="polite"` region for the whole app, created on first use. The text is cleared
 * first so the same message twice in a row (two equal scans) is announced again.
 *
 * @returns `announce(message)`.
 */
const useAnnouncer = () => (message: string) => {
  const region = getRegion();
  region.textContent = '';
  // The next frame: assistive tech notices the change even with the same text.
  requestAnimationFrame(() => {
    region.textContent = message;
  });
};

export default useAnnouncer;
