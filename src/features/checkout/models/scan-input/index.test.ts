/**
 * @fileoverview Unit tests for `parseScanInput` (CU-01, RN-08).
 * Verifies plain codes, multipliers and every invalid input.
 */
import { parseScanInput } from '.';

describe('Checkout: parseScanInput', () => {
  it('should read a plain code and a code with multiplier', () => {
    // Arrange
    const inputs = ['  8412345000010 ', '6*8412345000010', '1001'];

    // Act
    const results = inputs.map(parseScanInput);

    // Assert
    expect(results).toEqual([
      { kind: 'scan', code: '8412345000010', quantity: 1 },
      { kind: 'scan', code: '8412345000010', quantity: 6 },
      { kind: 'scan', code: '1001', quantity: 1 },
    ]);
  });

  it('should tell empty, invalid codes and invalid quantities apart', () => {
    // Arrange
    const inputs = [
      '   ',
      'ABC123',
      '123',
      '123456789012345',
      '0*8412345000010',
      '1000*8412345000010',
    ];

    // Act
    const kinds = inputs.map((input) => parseScanInput(input).kind);

    // Assert
    expect(kinds).toEqual([
      'empty',
      'invalid-code',
      'invalid-code',
      'invalid-code',
      'invalid-quantity',
      'invalid-quantity',
    ]);
  });
});
