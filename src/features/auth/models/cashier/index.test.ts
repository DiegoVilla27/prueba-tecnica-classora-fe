/**
 * @fileoverview Unit tests for the cashier model helpers.
 * Verifies the full name and initials shown in the header.
 */
import { cashierFullName, cashierInitials, type Cashier } from '.';

const cashier: Cashier = {
  id: '5f8ebc23-bfd6-4b1d-85aa-ccc44236d910',
  firstName: 'Ana',
  lastName: 'López',
  email: 'cajero@pos.local',
};

describe('Auth: cashier model', () => {
  it('should build the full name and the initials', () => {
    // Arrange
    const input = cashier;

    // Act
    const fullName = cashierFullName(input);
    const initials = cashierInitials(input);

    // Assert
    expect(fullName).toBe('Ana López');
    expect(initials).toBe('AL');
  });
});
