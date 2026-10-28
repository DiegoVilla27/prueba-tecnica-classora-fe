/**
 * @fileoverview Smoke test of the app shell in a real browser.
 * Verifies an anonymous visit lands on the login, in Spanish and without serious a11y issues.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('App: smoke', () => {
  test('should send an anonymous visit to the login without accessibility violations', async ({
    page,
  }) => {
    // Arrange
    await page.goto('/');

    // Act
    const heading = page.getByRole('heading', { name: 'Entra en tu caja' });
    const results = await new AxeBuilder({ page }).analyze();

    // Assert
    await expect(heading).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    expect(
      results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
    ).toEqual([]);
  });
});
