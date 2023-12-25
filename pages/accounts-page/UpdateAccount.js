import { expect } from '@playwright/test';

/**
 * <b>PAGES : CPQ : ACCOUNTS</b> [Update]: Update an existing Account
 */
export class UpdateAccount {
    constructor(page) {
        (async() => {
            this.page = page;
            // searchAccount
            this.listView = page.getByRole('button', { name: 'Select a List View: Accounts' });
            this.allAccounts = page.getByRole('option', { name: 'All Accounts' });
            this.searchBar = page.getByPlaceholder('Search this list...');
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
        await expect(this.listView).toBeVisible();
        await this.listView.click();
        await this.allAccounts.click();

        await this.searchBar.click();
        await this.searchBar.fill( accountName );
        await expect(this.searchBar).toHaveValue( accountName );
        await this.searchBar.press('Enter');

        this.searchedAccount = this.page.getByRole('link', { name: accountName });
        await this.searchedAccount.first().click();
        this.accountNameVerification = this.page.locator("//lightning-formatted-text[@class='custom-truncate' and text()='" + accountName + "']").last();
        const accName = await this.accountNameVerification.textContent();
        expect(accName).toBe( accountName );
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
        await this.editBillingAddress.click();

        if(typeof streetValue === 'string' && streetValue.trim().length > 0) {
            await this.billingStreet.click();
            await this.billingStreet.fill( streetValue );
        }

        if(typeof postalCodeValue === 'string' && postalCodeValue.trim().length > 0) {
            await this.billingPostalCode.click();
            await this.billingPostalCode.fill( postalCodeValue );
        }

        if(typeof cityValue === 'string' && cityValue.trim().length > 0) {
            await this.billingCity.click();
            await this.billingCity.fill( cityValue );
        }

        if(typeof provinceValue === 'string' && provinceValue.trim().length > 0) {
            await this.billingProvince.click();
            await this.billingProvince.fill( provinceValue );
        }

        if(typeof countryValue === 'string' && countryValue.trim().length > 0) {
            await this.billingCountry.click();
            await this.billingCountry.fill( countryValue );
        }

        await this.saveButton.click();
    };
};
