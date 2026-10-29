/**
 * @fileoverview Unit tests for the euro → cents conversion.
 * Verifies API decimals never lose a cent.
 */
import { fromEuros } from '.';

describe('Utils: fromEuros', () => {
  it('should convert euros to cents without floating point errors', () => {
    // Arrange
    const prices = [0.95, 0.1, 8.95, 948.1, 0.07];

    // Act
    const cents = prices.map(fromEuros);

    // Assert
    expect(cents).toEqual([95, 10, 895, 94810, 7]);
  });
});
