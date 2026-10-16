import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rw_onboarded', '1'));
});

test('reports quick report posts to the top of the feed', async ({ page }) => {
  await page.goto('/reports');
  await expect(page.getByRole('heading', { name: 'Community reports' })).toBeVisible();
  await page.getByRole('button', { name: 'City Hall', exact: true }).click();
  await page.getByRole('button', { name: 'Slippery', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('"Slippery" at City Hall is live');
  const first = page.locator('.rw-item').first();
  await expect(first).toContainText('Slippery');
  await expect(first).toContainText('You');
});

test('reports filter, search, and empty state', async ({ page }) => {
  await page.goto('/reports');
  await expect(page.locator('.rw-item')).toHaveCount(11);
  await page.locator('.rw-filter', { hasText: 'Crowded' }).click();
  await expect(page.locator('.rw-item')).toHaveCount(3);
  await page.getByRole('textbox', { name: 'Search reports' }).fill('zzz');
  await expect(page.getByText('Nothing matches')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.rw-item')).toHaveCount(11);
});

test('reports confirm adds one confirmation', async ({ page }) => {
  await page.goto('/reports');
  const btn = page.getByRole('button', { name: /^Still true: Wet at Bras Basah/ });
  await expect(btn).toHaveText(/8$/);
  await btn.click();
  await expect(btn).toHaveText(/9$/);
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
});
