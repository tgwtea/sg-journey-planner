import { test, expect } from '@playwright/test';

test('API health check responds', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).status).toBe('ok');
});

test('home renders the weather hero and the tab bar', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('every tab opens its screen', async ({ page }) => {
  await page.goto('/');
  const screens = [
    ['Routes', 'Compare routes'],
    ['Map', 'Rain-aware map'],
    ['Saved', 'Saved routes'],
    ['Reports', 'Community reports'],
  ];
  for (const [tab, heading] of screens) {
    await page.getByRole('link', { name: tab }).click();
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('home loads the weather on open', async ({ page }) => {
  await page.goto('/');
  // Success, empty, or error all count: the hero must leave idle and loading.
  await expect(page.getByText('Weather not loaded')).toHaveCount(0);
  await expect(page.getByText('Loading weather…')).toHaveCount(0, { timeout: 15000 });
});

test('weather switch changes the sky', async ({ page }) => {
  await page.goto('/');
  // Wait for the live fetch, so its condition does not overwrite the switch.
  await expect(page.getByText('Loading weather…')).toHaveCount(0, { timeout: 15000 });
  await page.getByRole('radio', { name: 'Heavy rain' }).click();
  await expect(page.locator('[data-rwroot]')).toHaveAttribute('data-wx', 'heavy');
});
