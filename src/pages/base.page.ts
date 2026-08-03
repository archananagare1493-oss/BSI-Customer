// src/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    page.setDefaultTimeout(50000); // 10 seconds default timeout
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    //await this.page.waitForTimeout(30000); // Add a short delay to ensure the element is fully interactable
    await locator.click();
  }

  async type(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }
}