import { Before, After, Status } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';
import { LoginPage } from '../pages/LoginPage';

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
