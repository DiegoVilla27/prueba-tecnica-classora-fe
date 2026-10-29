import { z } from 'zod';
import { CHECKOUT_MESSAGES } from '../../../../constants/messages';
import { parseScanInput } from '../../../../models/scan-input';

/**
 * Scan form validation. The rules live in `parseScanInput` (one source of truth, CLAUDE.md §4):
 * the schema only turns its result into field errors. An empty field is valid (CU-01 A1).
 */
const ScanSchema = z.object({ code: z.string() }).superRefine(({ code }, context) => {
  const { kind } = parseScanInput(code);
  if (kind === 'invalid-code' || kind === 'invalid-quantity') {
    context.addIssue({
      code: 'custom',
      path: ['code'],
      message:
        kind === 'invalid-code' ? CHECKOUT_MESSAGES.invalidCode : CHECKOUT_MESSAGES.invalidQuantity,
    });
  }
});

export type ScanFormValues = z.infer<typeof ScanSchema>;

export default ScanSchema;
