/**
 * @fileoverview Unit tests for `formatMoney`.
 * Verifies cents are shown as Spanish euros, like the Figma frames.
 */
import { formatMoney } from '.';

describe('Utils: formatMoney', () => {
  it('should format cents as Spanish euros', () => {
    // Arrange
    const amounts = [1494, 10, 96209, 0];

    // Act
    const formatted = amounts.map(formatMoney).map((text) => text.replace(/ /g, ' '));

    // Assert
    expect(formatted).toEqual(['14,94 €', '0,10 €', '962,09 €', '0,00 €']);
  });
});
