import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: 'npm run dev:backend', url: 'http://localhost:3000/api/health', reuseExistingServer: true },
    { command: 'npm run dev:frontend', url: 'http://localhost:5173', reuseExistingServer: true },
  ],
});
