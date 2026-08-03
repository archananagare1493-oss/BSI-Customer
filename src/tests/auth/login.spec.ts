import { test } from '../../fixtures/base.fixture';
import { expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  // const userName = process.env[`USER_NAME_${process.env.TEST_ENV}`];
  // const password = process.env[`PASSWORD_${process.env.TEST_ENV}`];
  // const userName = process.env[`USER_NAME_${process.env.TEST_ENV}`] || 'defaultUser';
  // const password = process.env[`PASSWORD_${process.env.TEST_ENV}`] || 'defaultPassword';
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo('');
  });

  test('Should successfully log in with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login();
    await expect(page).toHaveTitle('BSI Customer Suite');
    //await expect(page).toHaveURL('/bsicrm/');
  });

  test('Should not log in with invalid credentials', async ({ loginPage, page }) => {
    //await loginPage.login('invalid.user@example.com', 'WrongPassword123!');
    await loginPage.invalidLogin();
    // Confirm we did not navigate to the application main dashboard
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/\/bsicrm-dashoard\/?/);
    await expect(page.locator('//button[text()="Anmeldung fehlgeschlagen"]')).toBeVisible();
  });

});