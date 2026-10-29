import { expect, type Page } from '@playwright/test';

/** Demo cashier: the MSW one in `mocked`, the seeded one of the target API in `full-stack`. */
export const demoCashier = {
  email: process.env.E2E_EMAIL ?? 'cajero@pos.local',
  password: process.env.E2E_PASSWORD ?? 'cajero1234',
  name: process.env.E2E_CASHIER_NAME ?? 'Ana López',
};

/** Fills the login form like a cashier would (keyboard only) and submits it with Enter. */
export const loginWithKeyboard = async (page: Page, email: string, password: string) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Entra en tu caja' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.keyboard.press('Enter');
};
