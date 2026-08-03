import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage{
    private readonly welcomeMessage: Locator;
    private readonly actualWelcomeMsg: String;
    private readonly dropDownBtn: Locator;
    private readonly cockpitOption: Locator;
    private readonly customerDataOption: Locator;
    private readonly serviceOption: Locator;

    constructor(page: Page) {
        super(page);
        this.actualWelcomeMsg = "Willkommen Manisha";
        this.welcomeMessage = page.locator(`//strong[contains(text(),"${this.actualWelcomeMsg}")]`);
        //this.welcomeMessage = page.locator('//strong[contains(text(),"Willkommen Manisha")]');
        this.dropDownBtn = page.locator('//div[@class="action view-menu"]/span');
        // this.cockpitOption = page.locator('//div[@role="menu"]/div/div[text()="Cockpit"]');
        // this.customerDataOption = page.locator('//div[@role="menu"]/div/div[text()="Customer Data"]');
        // this.serviceOption = page.locator('//div[@role="menu"]/div/div[text()="Service"]');
        //this.dropDownBtn = page.getByRole('button', { pressed: true }).filter({ hasText: '' });
        this.cockpitOption = page.getByRole('menuitem', { name: 'Cockpit' });
        this.customerDataOption = page.getByRole('menuitem', { name: 'Customer Data' });
        this.serviceOption = page.getByRole('menuitem', { name: 'Service' });

    }
    async verifyWelcomeMessage() {
        console.log(`${this.welcomeMessage}`);
        await expect(this.welcomeMessage).toBeVisible({timeout: 30000});
    }
    async clickDropDown() {
        await this.dropDownBtn.click();
    }
    async clickCockpitOption() {
        await this.cockpitOption.click();
    }
    async clickCustomerDataOption() {
        await this.customerDataOption.click();
    }
    async clickServiceOption() {
        await this.serviceOption.click();
    }
}