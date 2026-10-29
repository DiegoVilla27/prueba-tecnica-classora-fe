/**
 * @fileoverview E2E of the checkout against the MSW worker (deterministic).
 * Critical flows of docs/05-testing.md §5 in a real browser.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { codeField, saleRows, scan, totalText, waitForCheckout } from '../support/checkout.ts';
import { demoCashier, loginWithKeyboard } from '../support/login.ts';

const MILK = '8412345000010';
const BREAD = '8412345000027';
const BAG = '8412345000119';

test.describe('Checkout (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithKeyboard(page, demoCashier.email, demoCashier.password);
    await waitForCheckout(page);
  });

  test('checkout-happy-path: fast scans, total, F12, confirm and new sale', async ({ page }) => {
    // Arrange: a barcode reader fires codes with no pause between them
    const codes = [MILK, MILK, BREAD, `3*${BAG}`];

    // Act
    for (const code of codes) await scan(page, code);

    // Assert: every scan arrived, in order, and the field is ready for the next one
    await expect(saleRows(page)).toHaveCount(3);
    await expect(saleRows(page).nth(0)).toContainText('Leche entera 1L');
    await expect(saleRows(page).nth(2)).toContainText('Bolsa de papel');
    await expect(codeField(page)).toHaveValue('');
    await expect(codeField(page)).toBeFocused();
    await expect.poll(() => totalText(page)).toBe('3,85 €');

    // Act: F12 → review → Enter confirms
    await page.keyboard.press('F12');
    await expect(page.getByRole('dialog', { name: '¿Finalizar esta venta?' })).toBeVisible();
    await page.keyboard.press('Enter');

    // Assert: straight to a new empty sale (total 0) with the paid total in a notice
    await expect(page.getByRole('main').getByText(/Venta finalizada · 3,85/)).toBeVisible();
    await expect(page.getByText('Escanea un producto para empezar')).toBeVisible();
    await expect.poll(() => totalText(page)).toBe('0,00 €');
    await expect(codeField(page)).toBeFocused();
  });

  test('checkout-unknown-code: shows the error, then the corrected code is added', async ({
    page,
  }) => {
    // Arrange
    await scan(page, '0000');

    // Act
    await expect(page.getByRole('alert')).toHaveText(
      'No existe ningún producto con el código 0000. Revisa el código.',
    );
    await scan(page, MILK); // the wrong text is selected: typing replaces it

    // Assert
    await expect(saleRows(page)).toHaveCount(1);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('checkout-remove-undo: removes a line and brings it back', async ({ page }) => {
    // Arrange
    await scan(page, MILK);
    await scan(page, BREAD);
    await expect(saleRows(page)).toHaveCount(2);

    // Act
    await page.getByRole('button', { name: 'Eliminar Leche entera 1L' }).click();
    await expect(saleRows(page)).toHaveCount(1);
    await page.getByRole('button', { name: 'Deshacer' }).click();

    // Assert
    await expect(saleRows(page)).toHaveCount(2);
    await expect.poll(() => totalText(page)).toBe('2,60 €');
  });

  test('checkout-keyboard-a11y: the whole sale without the mouse and no serious axe issues', async ({
    page,
  }) => {
    // Arrange
    await scan(page, MILK);
    await scan(page, BAG);
    await expect(saleRows(page)).toHaveCount(2);

    // Act: ↓ selects, + adds a unit, Supr removes, Ctrl+Z restores
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('+');
    await expect.poll(() => totalText(page)).toBe('2,00 €');
    await page.keyboard.press('Delete');
    await expect(saleRows(page)).toHaveCount(1);
    await page.keyboard.press('Control+z');
    await expect(saleRows(page)).toHaveCount(2);
    // Toasts animate in and out (opacity), so axe would measure them mid-animation. Their colours
    // are design tokens checked once (inverse/on-primary 15.1:1, docs/03-ux-ui.md §4.1).
    const results = await new AxeBuilder({ page }).exclude('[data-sonner-toaster]').analyze();

    // Assert
    expect(
      results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
    ).toEqual([]);
  });
});
