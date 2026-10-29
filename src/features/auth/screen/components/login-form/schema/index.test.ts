/**
 * @fileoverview Unit tests for `LoginSchema`.
 * Verifies valid credentials pass and the trimmed email is kept.
 */
import LoginSchema from '.';

describe('Auth: LoginSchema', () => {
  it('should accept valid credentials and trim the email', () => {
    // Arrange
    const values = { email: '  cajero@pos.local ', password: 'cajero1234' };

    // Act
    const result = LoginSchema.safeParse(values);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('cajero@pos.local');
  });

  it('should reject an empty email with its message', () => {
    // Arrange
    const values = { email: '', password: 'x' };

    // Act
    const result = LoginSchema.safeParse(values);

    // Assert
    expect(result.error?.issues[0]?.message).toBe('Introduce tu email.');
  });
});
