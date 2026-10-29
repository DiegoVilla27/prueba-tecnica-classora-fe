/**
 * @fileoverview E2E of the login against the MSW worker (deterministic).
 * Verifies the happy path, wrong credentials and logout in a real browser.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { demoCashier, loginWithKeyboard } from '../support/login.ts';

test.describe('Auth: login (mocked)', () => {
  test('should sign in, show the cashier and log out', async ({ page }) => {
    // Arrange
    await loginWithKeyboard(page, demoCashier.email, demoCashier.password);

    // Act
    await expect(page.getByText(demoCashier.name)).toBeVisible();
    await page.getByRole('button', { name: 'Salir' }).click();

    // Assert
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Entra en tu caja' })).toBeVisible();
  });

  test('should explain wrong credentials without serious accessibility issues', async ({
    page,
  }) => {
    // Arrange
    await loginWithKeyboard(page, demoCashier.email, 'wrong-password');

    // Act
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();

    // Assert
    await expect(alert).toHaveText('Email o contraseña incorrectos.');
    await expect(page.getByLabel('Contraseña', { exact: true })).toBeFocused();
    expect(
      results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
    ).toEqual([]);
  });
});
