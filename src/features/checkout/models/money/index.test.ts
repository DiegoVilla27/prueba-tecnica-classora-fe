/**
 * @fileoverview Unit tests for the money value object (integer cents).
 * Verifies the arithmetic used for subtotals and totals.
 */
import { addMoney, multiplyMoney } from '.';

describe('Checkout: money', () => {
  it('should add and multiply in cents', () => {
    // Arrange
    const milk = 95;

    // Act
    const total = addMoney(multiplyMoney(milk, 3), 10);

    // Assert
    expect(total).toBe(295);
  });
});
