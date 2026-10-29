/**
 * @fileoverview Unit tests for the auth mappers.
 * Verifies the API cashier becomes the domain model.
 */
import { toCashier } from '.';

describe('Auth: mappers', () => {
  it('should map the /users/me response to a cashier', () => {
    // Arrange
    const dto = {
      id: '5f8ebc23-bfd6-4b1d-85aa-ccc44236d910',
      firstName: 'Ana',
      lastName: 'López',
      email: 'cajero@pos.local',
    };

    // Act
    const cashier = toCashier(dto);

    // Assert
    expect(cashier).toEqual(dto);
  });
});
