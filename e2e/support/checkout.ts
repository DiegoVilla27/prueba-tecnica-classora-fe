import { expect, type Page } from '@playwright/test';

/** Code field of the checkout. */
export const codeField = (page: Page) => page.getByRole('textbox', { name: 'Código de producto' });

/** Waits until the sale is loaded and the code field accepts scans. */
export const waitForCheckout = async (page: Page) => {
  await expect(codeField(page)).toBeEnabled({ timeout: 60_000 });
};

/** Scans like a barcode reader: types the code at full speed and presses Enter. */
export const scan = async (page: Page, code: string) => {
  await codeField(page).pressSequentially(code, { delay: 0 });
  await page.keyboard.press('Enter');
};

/** Text of the sale total, with the non-breaking space normalized. */
export const totalText = async (page: Page) =>
  (
    await page
      .getByRole('region', { name: 'Total de la venta' })
      .getByText(/€/)
      .first()
      .textContent()
  )?.replace(/ /g, ' ');

/** Rows of the sale table (without the header). */
export const saleRows = (page: Page) => page.locator('tbody tr');

/**
 * Real API only: a previous run may have left an open sale with products. Empty it so every
 * full-stack test starts from an empty sale.
 */
export const startWithEmptySale = async (page: Page) => {
  await waitForCheckout(page);
  const clear = page.getByRole('button', { name: 'Vaciar venta' });
  if (await clear.isEnabled()) {
    await clear.click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Vaciar venta' }).click();
    await expect(page.getByText('Escanea un producto para empezar')).toBeVisible();
  }
};
