/**
 * @fileoverview E2E of the login against the real Java API (`pnpm local` + backend on :8080).
 * Verifies real tokens, CORS and /users/me work together.
 */
import { expect, test } from '@playwright/test';
import { demoCashier, loginWithKeyboard } from '../support/login.ts';

test.describe('Auth: login (full-stack)', () => {
  test('should sign in against the API and show the seeded cashier', async ({ page }) => {
    // Arrange
    await loginWithKeyboard(page, demoCashier.email, demoCashier.password);

    // Act
    const cashierName = page.getByText(demoCashier.name);

    // Assert
    await expect(page).toHaveURL(/\/$/);
    await expect(cashierName).toBeVisible();
  });

  test('should reject wrong credentials with the API 401', async ({ page }) => {
    // Arrange
    await loginWithKeyboard(page, demoCashier.email, 'wrong-password');

    // Act
    const alert = page.getByRole('alert');

    // Assert
    await expect(alert).toHaveText('Email o contraseña incorrectos.');
  });
});
