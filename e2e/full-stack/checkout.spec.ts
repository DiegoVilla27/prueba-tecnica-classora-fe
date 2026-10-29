/**
 * @fileoverview E2E of the checkout against the real Java API (`pnpm local` + backend :8080).
 * Verifies the sale really lives on the server: totals, completion and recovery after a reload.
 */
import { expect, test } from '@playwright/test';
import {
  saleRows,
  scan,
  startWithEmptySale,
  totalText,
  waitForCheckout,
} from '../support/checkout.ts';
import { demoCashier, loginWithKeyboard } from '../support/login.ts';

const MILK = '8412345000010';
const BAG = '8412345000119';

test.describe('Checkout (full-stack)', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithKeyboard(page, demoCashier.email, demoCashier.password);
    await startWithEmptySale(page);
  });

  test('checkout-happy-path: scans against the API and completes the sale', async ({ page }) => {
    // Arrange
    const codes = [MILK, MILK, `3*${BAG}`];

    // Act
    for (const code of codes) await scan(page, code);
    await expect.poll(() => totalText(page)).toBe('2,20 €');
    await page.keyboard.press('F12');
    await page.keyboard.press('Enter');

    // Assert
    await expect(page.getByRole('main').getByText(/Venta finalizada · 2,20/)).toBeVisible();
    await page.getByRole('button', { name: 'Nueva venta' }).click();
    await expect(page.getByText('Escanea un producto para empezar')).toBeVisible();
  });

  test('checkout-recover-sale: the open sale survives a reload', async ({ page }) => {
    // Arrange
    await scan(page, MILK);
    await scan(page, BAG);
    await expect(saleRows(page)).toHaveCount(2);
    await expect.poll(() => totalText(page)).toBe('1,05 €');

    // Act: the total is optimistic, wait until the requests have reached the API
    await page.waitForLoadState('networkidle');
    await page.reload();
    await waitForCheckout(page);

    // Assert
    await expect(saleRows(page)).toHaveCount(2);
    await expect.poll(() => totalText(page)).toBe('1,05 €');
    await startWithEmptySale(page); // leave the real database clean
  });
});
