import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { InventoryPage } from '../pages/InventoryPage';

Given('el usuario esta en la pagina de login de SauceDemo', async function (this: CustomWorld) {
  await this.loginPage.goto();
});

When(
  'el usuario ingresa el usuario {string} y la contrasena {string}',
  async function (this: CustomWorld, usuario: string, contrasena: string) {
    await this.loginPage.fillUsername(usuario);
    await this.loginPage.fillPassword(contrasena);
  }
);

When('hace clic en el boton de login', async function (this: CustomWorld) {
  await this.loginPage.clickLoginButton();
});

Then('el usuario deberia ver la pagina de productos', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.expectLoaded();
});

Then('deberia ver el mensaje de error {string}', async function (this: CustomWorld, mensaje: string) {
  const error = await this.loginPage.getErrorMessage();
  expect(error).toContain(mensaje);
});
