import { test } from '../../fixtures/base.fixture';
import { expect } from '@playwright/test';


test.describe('Global Search by First Name', () => {
    test.beforeEach('Login', async ({ loginPage }) => {
        await loginPage.navigateTo('');
        await loginPage.login();
    });
    test('Navigate to Customer Data', async({ homePage }) => {
        await homePage.clickDropDown();
        await homePage.clickCustomerDataOption();
    });
    test('Go to All Customer', async ({ homePage, searchPage }) => {
        await homePage.clickDropDown();
        await homePage.clickCustomerDataOption();
        await searchPage.clickAlleKunden();
    });
    test('Click on Global Search', async({ homePage, searchPage }) => {
        await homePage.clickDropDown();
        await homePage.clickCustomerDataOption();
        await searchPage.clickAlleKunden();
        await searchPage.searchClick();
    });
    test('Search by First Name', async({ homePage, searchPage }) => {
        await homePage.clickDropDown();
        await homePage.clickCustomerDataOption();
        await searchPage.clickAlleKunden();
        await searchPage.searchClick();
        await searchPage.enterInSearchInput('Sonja');
    });
    test('Verify Search results by First Name', async({ homePage, searchPage }) => {
        await homePage.clickDropDown();
        await homePage.clickCustomerDataOption();
        await searchPage.clickAlleKunden();
        await searchPage.searchClick();
        await searchPage.enterInSearchInput('Sonja');
        await searchPage.verifySearchResultsByFirstName('Sonja');
    });

});