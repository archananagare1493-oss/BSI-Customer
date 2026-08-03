//Global Search by Postcode
import { test } from '../../fixtures/base.fixture';
import { expect } from '@playwright/test';

test.describe('Global Search by Postcode', () => {
//   const userName = process.env[`USER_NAME_${process.env.TEST_ENV}`] || process.env.USER_NAME_FAIT || '';
//   const password = process.env[`PASSWORD_${process.env.TEST_ENV}`] || process.env.PASSWORD_FAIT || ''; 
//   test('The global search should be displayed the customer records matching the entered postal code', async ({ loginPage, searchPage }) => {
//     await loginPage.navigateTo('');
//     await loginPage.login(userName, password);
//     await searchPage.searchClick();
//     await searchPage.clickAlleKunden();
//     await searchPage.searchByPostcode('31303');
//     await searchPage.verifySearchResultsByPostcode('124024718');
//   });
    test.beforeEach('Login', async ({ loginPage }) => {
        await loginPage.navigateTo('');
        await loginPage.login();
    });
    test('Go to All Customer', async ({ searchPage }) => {
        await searchPage.searchClick();
        await searchPage.clickAlleKunden();
    });
    test('Search by Postcode', async ({ searchPage }) => {
        await searchPage.searchClick();
        await searchPage.clickAlleKunden();
        await searchPage.enterInSearchInput('31303');
    });
    test('Verify Search results by Postcode', async ({ searchPage }) => {
        await searchPage.searchClick();
        await searchPage.clickAlleKunden();
        //await searchPage.searchByPostcode('31303');
        await searchPage.enterInSearchInput('31303');
        await searchPage.verifySearchResultsByPostcode('12362860');
    });
});