import { LIMITS } from '../../constants/limits';

/** Result of reading what the cashier typed or scanned in the code field. */
export type ScanInput =
  | { kind: 'empty' }
  | { kind: 'invalid-code' }
  | { kind: 'invalid-quantity' }
  | { kind: 'scan'; code: string; quantity: number };

const SCAN_PATTERN = /^(?:(\d+)\*)?(\d+)$/;

/**
 * Reads the code field (CU-01): `"8412345000010"` or, with a multiplier, `"6*8412345000010"`.
 *
 * @remarks
 * Spaces around are ignored (RN-08). A code is 4–14 digits (RN-08); a multiplier 1–999 (RN-02).
 * An empty field is not an error: a stray Enter does nothing (A1).
 *
 * @param raw - Text of the field.
 * @returns What to do with it.
 */
export const parseScanInput = (raw: string): ScanInput => {
  const text = raw.trim();
  if (text === '') return { kind: 'empty' };

  const match = SCAN_PATTERN.exec(text);
  const code = match?.[2];
  if (!code || code.length < LIMITS.minCodeLength || code.length > LIMITS.maxCodeLength) {
    return { kind: 'invalid-code' };
  }

  const quantity = match?.[1] === undefined ? 1 : Number(match[1]);
  if (quantity < LIMITS.minQuantity || quantity > LIMITS.maxQuantity) {
    return { kind: 'invalid-quantity' };
  }

  return { kind: 'scan', code, quantity };
};
