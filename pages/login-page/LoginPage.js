import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class LoginPage {
	constructor(page) {
		//(async() => {
		this.page = page;
		this.username = page.locator("//input[@id='username']");
		this.password = page.locator("//input[@id='password']");
		this.loginButton = page.locator("//input[@id='Login']");
		//})();
	}

	/**
	 * <b>[Method]</b> - Login to salesforce <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality logins to the salesforce app. <br>
	 * <br>
	 * @param {string} username - The value of the salesforce username.
	 * @param {string} password - The value of the salesforce password.
	 * @param {boolean} api - true if the authorization is through api.
	 */
	async login(username, password, api) {
		// Login to salesforce
		await allure.step('Log in to salesforce', async () => {
			if (api === true) {
				await allure.step('API authorization', async () => {
					await this.page.goto(`${process.env.sfUrl + process.env.authorizationEndpoint}?response_type=code&client_id=${process.env.clientId}&redirect_uri=${process.env.redirectUri}`);
				});
			} else {
				await allure.step('UI authorization', async () => {
					await this.page.goto('https://test.salesforce.com'); //https://test.salesforce.com
				});
			}

			await this.username.fill(username);
			await expect(this.username).toHaveValue(username);
			await this.password.fill(password);
			await expect(this.password).toHaveValue(password);
			await this.loginButton.click();
		});
	}
}
