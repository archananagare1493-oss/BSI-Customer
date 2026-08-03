import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { SearchPage } from '../pages/search.page';
import { reportTestFailureToJira } from '../utils/jira';
// Import other pages here as they are created

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  searchPage: SearchPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  }
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'failed') {
    await reportTestFailureToJira(testInfo);
  }
});

//export { expect };