import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('opens the base URL and shows the expected page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Example Domain/i);
  });
});
