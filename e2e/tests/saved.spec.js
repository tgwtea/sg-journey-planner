import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rw_onboarded', '1'));
});

test('saved shows alerts and routes, and alerts can be dismissed and restored', async ({ page }) => {
  await page.goto('/saved');
  await expect(page.getByRole('heading', { name: 'Saved routes and alerts' })).toBeVisible();
  const dismiss = page.getByRole('button', { name: 'Dismiss alert' });
  await expect(dismiss).toHaveCount(3);
  for (let i = 0; i < 3; i += 1) await dismiss.first().click();
  await expect(page.getByText('All clear, no alerts')).toBeVisible();
  await page.getByRole('button', { name: 'Restore demo alerts' }).click();
  await expect(dismiss).toHaveCount(3);
});

test('saved alert action shows a toast', async ({ page }) => {
  await page.goto('/saved');
  await page.getByRole('button', { name: 'Leave 10 min later' }).click();
  await expect(page.getByRole('status')).toContainText('Reminder moved to 8:25 AM');
});

test('saved alert switch updates the summary', async ({ page }) => {
  await page.goto('/saved');
  await expect(page.getByText('Rain alerts on for 2 of 4 routes')).toBeVisible();
  await page.getByRole('switch', { name: 'Rain alerts for Weekend gym' }).click();
  await expect(page.getByText('Rain alerts on for 3 of 4 routes')).toBeVisible();
});

test('saved plan opens the trip', async ({ page }) => {
  await page.goto('/saved');
  await page.getByRole('switch', { name: 'Rain alerts for Weekend gym' }).waitFor();
  const card = page.locator('.rw-route').filter({ hasText: 'Weekend gym' });
  await card.getByRole('button', { name: 'Plan' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('textbox', { name: 'Origin' })).toHaveValue('Bishan');
});
