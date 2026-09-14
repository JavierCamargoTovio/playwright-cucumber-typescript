import { Page } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput = this.page.locator('#user-name');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('#login-button');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
