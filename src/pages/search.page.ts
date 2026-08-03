import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class SearchPage extends BasePage {
    private readonly searchButton: Locator;
    private readonly searchResults: Locator;
    private readonly searchOptions: Locator;
    private readonly alleKundenBtn: Locator;
    private readonly suchenInput: Locator;
    private readonly postSearchResults: Locator;
    private readonly firstNameSearchResult: Locator;
    //private readonly searchresultsCount: Locator;
    constructor(page: Page) {
        super(page);
        this.searchButton = page.locator('//div[@aria-label="Suchen"]//span');
        this.searchResults = page.locator('//div[@role="button"]//span[text()="Alle Kunden"]');

        this.searchOptions = page.locator('//div[@role="button"]//span');
        //this.searchresultsCount = page.locator('//div[@role="button"]//span[text()="Alle Kunden"]/following-sibling::span');
        this.searchOptions = page.locator('//div[@class="field alternative with-icon"]//span[@class="label"]');
        this.alleKundenBtn = page.locator('//div[@role="button"]//span[text()="Alle Kunden"]');
        this.suchenInput = page.locator('//input[@class="search-outline-field"]');
        //this.postSearchResults = page.locator('//span[text()="31303"][1]');
        this.postSearchResults = page.locator('//div[@role="gridcell"]/span[text()="124024718"]');
        this.firstNameSearchResult = page.locator('(//*[contains(text(), "Sonja")])[1]');
    }
    async searchClick() {
        await this.searchButton.click();
    }
    //async verifySearchResults(expectedText: string) 
    async verifySearchResults(){
        const results = this.searchResults;
        ///await expect(results).toContainText(expectedText);
        await expect(results).toContainText("Alle Kunden");
    }
    async verifySearchOptions(expectedOptions: string[]) {
        await expect(this.searchOptions).toHaveCount(expectedOptions.length);
        const optionsText = await this.searchOptions.allTextContents();
        expect(optionsText).toEqual(expectedOptions);
    }
    async clickAlleKunden() {
        await this.alleKundenBtn.click();
    }
    // async searchByPostcode(postcode: string) {
    //     //const searchInput = this.suchenInput;
    //     await this.type(this.suchenInput, postcode);
    //     //await this.searchButton.click();
    // }
    async enterInSearchInput(text: string) {
        await this.type(this.suchenInput, text);
    }
    async verifySearchResultsByPostcode(expectedText: string) {
        //const results = this.page.locator(`//div[@role="button"]//span[contains(text(),"${expectedText}")]`);
        //await expect(results).toBeVisible();
        await expect(this.postSearchResults).toContainText(expectedText);
    }
    async verifySearchResultsByFirstName(expectedText: string) {
        await expect(this.firstNameSearchResult).toContainText(expectedText);
    }



    // async verifySearchResultsCount(expectedCount: number) {
    //     const countText = await this.searchresultsCount.textContent();
    //     const count = parseInt(countText ?? '0', 10);
    //     expect(count).toBe(expectedCount);
    // }
    // async verifyNoResults() {
    //     const noResultsMessage = page.locator('//div[@class="no-results"]');
    //     await expect(noResultsMessage).toBeVisible();
    // }
    // async verifyResultsCount(expectedCount: number) {
    //     const results = page.locator('//div[@class="search-results"]//p');
    //     await expect(results).toHaveCount(expectedCount);
    // }
}