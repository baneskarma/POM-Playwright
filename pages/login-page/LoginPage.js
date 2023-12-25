import { expect } from "@playwright/test";

export class LoginPage {
    constructor(page) {
        // (async() => {
            this.page = page;
            this.username = page.locator("//input[@id='username']");
            this.password = page.locator("//input[@id='password']");
            this.loginButton = page.locator("//input[@id='Login']");
        // })();
    };

    /**
     * <b>[Method]</b> - Login to salesforce <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality logins to the salesforce app. <br>
     * <br>
	 * @param {string} username - The value of the salesforce username.
	 * @param {string} password - The value of the salesforce password.
	 */
    async login( username, password ){

        // Login to salesforce 

        await this.page.goto("https://test.salesforce.com");
        await this.username.fill(username);
        //await this.page.locator(this.username).fill(username);
        await expect(this.username).toHaveValue(username);
        await this.password.fill(password);
        await expect(this.password).toHaveValue(password);
        await this.loginButton.click();
    };
};