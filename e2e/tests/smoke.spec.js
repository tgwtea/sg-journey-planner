import { test, expect } from '@playwright/test';

// Skip the first-visit welcome dialog, except in the test that checks it.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.startsWith('onboarding')) return;
  await page.addInitScript(() => localStorage.setItem('rw_onboarded', '1'));
});

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

test('weather follows live data until the switch overrides it', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('radio', { name: 'Live' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('radio', { name: 'Heavy rain' }).click();
  await expect(page.locator('[data-rwroot]')).toHaveAttribute('data-wx', 'heavy');
  await page.getByRole('radio', { name: 'Clear' }).click();
  await expect(page.locator('[data-rwroot]')).toHaveAttribute('data-wx', 'clear');
});

test('dark mode toggle switches the theme', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('[data-rwroot]');
  await expect(root).toHaveAttribute('data-rw', 'light');
  await page.getByRole('button', { name: 'Toggle dark mode' }).click();
  await expect(root).toHaveAttribute('data-rw', 'dark');
});

test('onboarding shows on the first visit and closes', async ({ page }) => {
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Welcome to RouteWise' });
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Explore on my own' }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(dialog).toHaveCount(0);
});

test('guided tour moves across screens', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The tour button shows on wide screens only.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start guided tour' }).click();
  const tour = page.getByRole('dialog', { name: 'Guided tour' });
  await expect(tour).toContainText('1 / 9');
  for (let i = 0; i < 3; i += 1) await tour.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL(/\/routes$/);
  await tour.getByRole('button', { name: 'End tour' }).click();
  await expect(tour).toHaveCount(0);
});

test('map screen loads OneMap tiles and stop markers', async ({ page }) => {
  await page.goto('/map');
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.leaflet-control-attribution')).toContainText('OneMap');
  await expect(page.getByTitle('Dhoby Ghaut MRT station')).toBeVisible();
});

test('home recommends wait in heavy rain and leave now when clear', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Heavy rain' }).click();
  await expect(page.getByText(/^Wait \d+ min$/)).toBeVisible();
  await page.getByRole('radio', { name: 'Clear' }).click();
  await expect(page.getByText('Leave now', { exact: true })).toBeVisible();
});

test('home planner runs a plan and sets a reminder', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Changi Airport' }).click();
  await expect(page.getByRole('textbox', { name: 'Destination' })).toHaveValue('Changi Airport');
  await page.getByRole('button', { name: 'Plan route' }).click();
  await expect(page.getByText('Checking your options…')).toBeVisible();
  await expect(page.getByText('RouteWise recommends')).toBeVisible();
  await page.getByRole('button', { name: /Remind me at/ }).click();
  await expect(page.getByRole('status')).toContainText('We will remind you at');
});

test('home nearby stop opens the map', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Dhoby Ghaut/ }).first().click();
  await expect(page).toHaveURL(/\/map$/);
});
