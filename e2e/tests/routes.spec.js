import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rw_onboarded', '1'));
});

const ranks = (page) => page.locator('article .rw-mono').filter({ hasText: /^0\d$/ });
const names = (page) => page.locator('article').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label').split(':')[1].split(',')[0].trim()));

test('routes shows 4 cards and sorts them', async ({ page }) => {
  await page.goto('/routes');
  await expect(page.locator('article')).toHaveCount(4);
  await expect(ranks(page).first()).toHaveText('01');
  await page.getByRole('button', { name: 'Fastest', exact: true }).click();
  expect((await names(page))[0]).toBe('NE Line direct');
  await page.getByRole('button', { name: 'Least walking', exact: true }).click();
  expect((await names(page))[0]).toBe('Bus 80 direct');
});

test('routes move and pin set a custom order', async ({ page }) => {
  await page.goto('/routes');
  await page.getByRole('button', { name: 'Fastest', exact: true }).click();
  await page.getByRole('button', { name: 'Move down' }).first().click();
  await expect(page.getByRole('button', { name: 'Custom' })).toHaveAttribute('aria-pressed', 'true');
  expect((await names(page))[1]).toBe('NE Line direct');
  const last = (await names(page))[3];
  await page.getByRole('button', { name: 'Pin route' }).nth(3).click();
  expect((await names(page))[0]).toBe(last);
});

test('routes view on map opens the map screen', async ({ page }) => {
  await page.goto('/routes');
  await page.getByRole('button', { name: 'View on map' }).first().click();
  await expect(page).toHaveURL(/\/map$/);
});
