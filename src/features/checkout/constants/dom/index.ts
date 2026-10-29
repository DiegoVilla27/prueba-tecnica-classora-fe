/** Id of the product code field: the checkout gives it the focus back after every action. */
export const SCAN_INPUT_ID = 'scan-code';

/** Moves the focus to the code field on the next frame (after dialogs or rows disappear). */
export const focusScanInput = (): void => {
  requestAnimationFrame(() => document.getElementById(SCAN_INPUT_ID)?.focus());
};
