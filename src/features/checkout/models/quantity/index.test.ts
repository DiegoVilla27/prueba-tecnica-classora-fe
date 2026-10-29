/**
 * @fileoverview Unit tests for the quantity rules (RN-02).
 * Verifies the 1–999 range.
 */
import { isValidQuantity } from '.';

describe('Checkout: quantity', () => {
  it('should accept whole quantities between 1 and 999 only', () => {
    // Arrange
    const candidates = [1, 999, 0, 1000, 1.5, Number.NaN];

    // Act
    const results = candidates.map(isValidQuantity);

    // Assert
    expect(results).toEqual([true, true, false, false, false, false]);
  });
});
