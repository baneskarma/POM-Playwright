import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * <b>PAGES : CPQ : ACCOUNTS</b> [Update]: Update an existing Account
 */
export class UpdateAccount {
    constructor(page) {
        (async() => {
            this.page = page;
            // searchAccount
            this.listView = page.getByRole('button', { name: 'Select a List View: Accounts' });
            this.newThisWeek = page.getByRole('option', { name: 'New This Week' });
            this.searchBar = page.getByPlaceholder('Search this list...');
            this.recentlyViewed = page.locator("//span[text()='Accounts']//following-sibling::span[text()='Recently Viewed']");
            this.searchedAccount;
            this.accountNameVerification;
            // billingAddress
            this.editBillingAddress = page.getByRole('button', { name: 'Edit Billing Address' });
            this.billingStreet = page.getByLabel('Billing Street');
            this.billingPostalCode = page.getByLabel('Billing Zip/Postal Code');
            this.billingCity = page.getByLabel('Billing City');
            this.billingProvince = page.getByLabel('Billing State/Province');
            this.billingCountry = page.getByLabel('Billing Country');
            this.saveButton = page.getByRole('button', { name: 'Save' });
        })();
    };

    /**
     * <b>[Method]</b> - Search for an account<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality searches for an account, then enters the account. <br>
     * <br>
	 * @param {string} accountName - The name of the account.
	 */
    async searchAccount( accountName ) {
        await allure.step("Search for account " + accountName, async () => {

            await allure.step("Search the account", async () => {

                await allure.step("Wait for listview to be visible", async () => {
                    await expect(this.listView).toBeVisible();
                });

                await allure.step("Select listview", async () => {
                    await this.listView.click();
                    await this.newThisWeek.click();
                });

                await allure.step("Searchbar actions", async () => {
                    await this.searchBar.click();
                    await this.searchBar.fill( accountName );
                    await expect(this.searchBar).toHaveValue( accountName );
                    await this.searchBar.press('Enter');
                });
            });

            await allure.step("Go to account " + accountName, async () => {

                await allure.step("Click on the searched account", async () => {
                    //this.searchedAccount = this.page.getByRole('link', { name: accountName });
                    await this.page.waitForLoadState('domcontentloaded');
                    this.searchedAccount = this.page.locator("//a[@title='" + accountName + "']");
                    await this.searchedAccount.first().click();
                });

                await allure.step("Click on searched account in recently viewed", async () => {
                    await expect(this.recentlyViewed).toBeVisible();
                    await this.searchedAccount.first().click();
                });

                await allure.step("Verify account name", async () => {
                    this.accountNameVerification = this.page.locator("//lightning-formatted-text[@class='custom-truncate' and text()='" + accountName + "']").last();
                    const accName = await this.accountNameVerification.textContent();
                    expect(accName).toBe( accountName );
                });
            });
        });
    };


    /**
     * <b>[Method]</b> - Update the billing address <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality updates the billing address, for the account where we are in. <br>
     * <br>
	 * @param {string} streetValue - The name of the street.
	 * @param {string} postalCodeValue - The value for the postal code.
	 * @param {string} cityValue - The name of the city.
	 * @param {string} provinceValue - The name of the province.
	 * @param {string} countryValue - The name of the country.
	 */
    async billingAddress( streetValue, postalCodeValue, cityValue, provinceValue, countryValue ) {
        await allure.step("Update billing address", async () => {
            await allure.step("Click edit billing address", async () => {
                await this.editBillingAddress.click();
            });

            if(typeof streetValue === 'string' && streetValue.trim().length > 0) {
                await allure.step("Update street value to " + streetValue, async () => {
                        await this.billingStreet.click();
                        await this.billingStreet.fill( streetValue );
                });
            };

            if(typeof postalCodeValue === 'string' && postalCodeValue.trim().length > 0) {
                await allure.step("Update postal code value to " + postalCodeValue, async () => {
                    await this.billingPostalCode.click();
                    await this.billingPostalCode.fill( postalCodeValue );
                });
            };

            if(typeof cityValue === 'string' && cityValue.trim().length > 0) {
                await allure.step("Update city value to " + cityValue, async () => {
                    await this.billingCity.click();
                    await this.billingCity.fill( cityValue );
                });
            };

            if(typeof provinceValue === 'string' && provinceValue.trim().length > 0) {
                await allure.step("Update province value to " + provinceValue, async () => {
                    await this.billingProvince.click();
                    await this.billingProvince.fill( provinceValue );
                });
            };

            if(typeof countryValue === 'string' && countryValue.trim().length > 0) {
                await allure.step("Update country value to " + countryValue, async () => {
                    await this.billingCountry.click();
                    await this.billingCountry.fill( countryValue );
                });
            };

            await allure.step("Save update", async () => {
                await this.saveButton.click();
            });
        });
    };
};
