import { Page, expect } from '@playwright/test';

export class InventoryPage {
  private readonly pageTitle = this.page.locator('.title');

  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }
}
