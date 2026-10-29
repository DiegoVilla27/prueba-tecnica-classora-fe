/**
 * @fileoverview E2E of the sales history against the MSW worker.
 * Verifies a completed sale shows up in "Ventas" with its detail, without accessibility issues.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { scan, totalText, waitForCheckout } from '../support/checkout.ts';
import { demoCashier, loginWithKeyboard } from '../support/login.ts';

test.describe('Sales history (mocked)', () => {
  test('should list a completed sale and show its lines', async ({ page }) => {
    // Arrange: one completed sale (the mock keeps the sales in memory while on the page)
    await loginWithKeyboard(page, demoCashier.email, demoCashier.password);
    await waitForCheckout(page);
    await scan(page, '2*8412345000010');
    await expect.poll(() => totalText(page)).toBe('1,90 €');
    await page.keyboard.press('F12');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main').getByText(/Venta finalizada · 1,90/)).toBeVisible();

    // Act
    await page.getByRole('link', { name: 'Ventas' }).click();
    const completed = page.locator('tbody tr', { hasText: 'Finalizada' });
    await completed.getByRole('button', { name: /Ver detalle/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Leche entera 1L');
    const results = await new AxeBuilder({ page }).exclude('[data-sonner-toaster]').analyze();

    // Assert
    await expect(page).toHaveURL(/\/ventas$/);
    await expect(completed).toContainText('1,90');
    await expect(dialog).toContainText('Finalizada · 2 artículos · 1 producto');
    expect(
      results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
    ).toEqual([]);
  });
});
