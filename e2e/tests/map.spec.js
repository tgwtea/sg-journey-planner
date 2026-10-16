import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rw_onboarded', '1'));
});

test('map search opens a stop with live arrivals', async ({ page }) => {
  await page.goto('/map');
  await page.getByRole('textbox', { name: 'Search stops' }).fill('dhoby');
  await page.locator('.rw-stop-row').first().click();
  await expect(page.getByRole('heading', { name: 'Dhoby Ghaut' })).toBeVisible();
  await expect(page.getByText('Live arrivals')).toBeVisible();
  await page.getByRole('button', { name: 'Close stop details' }).click();
  await expect(page.getByRole('heading', { name: 'Dhoby Ghaut' })).toHaveCount(0);
});

test('map quick report adds a report to the stop', async ({ page }) => {
  await page.goto('/map');
  await page.getByTitle('Dhoby Ghaut MRT station').click();
  await page.getByRole('button', { name: 'Crowded', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('"Crowded" at Dhoby Ghaut is live');
  await expect(page.locator('.rw-rep-title').first()).toContainText('Crowded');
});

test('map layer chips toggle', async ({ page }) => {
  await page.goto('/map');
  const bus = page.getByRole('button', { name: 'Bus stops' });
  await expect(bus).toHaveAttribute('aria-pressed', 'true');
  await bus.click();
  await expect(bus).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTitle('Opp SMU bus stop')).toHaveCount(0);
});

test('map plan from here sets the origin on Home', async ({ page }) => {
  await page.goto('/map');
  await page.getByTitle('City Hall MRT station').click();
  await page.getByRole('button', { name: 'Plan from here' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('textbox', { name: 'Origin' })).toHaveValue('City Hall');
});
