import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * <b>PAGES : CPQ : ACCOUNTS</b> [Verify]: Verify data from Account
 */
export class VerifyAccount {
	constructor( page ) {
		( async () => {
			this.page = page;
			// dynamic locators
			this.accountName;
			this.accountType;
			this.billingStreet;
			this.billingCity;
			this.billingPostalCode;
			this.billingProvince;
			this.billingCountry;
		})();
	}

	/**
	 * **[Method]** - Verify account data
	 *
	 * *Method functionality:*
	 * This functionality verifies the data of the opened account. <br>
	 *
	 * @param {string} name - The name of the account.
	 * @param {string} type - The type of the account.
	 * @param {{ billingStreet?: string, billingPostalCode?: string, billingCity?: string, billingProvince?: string, billingCountry?: string }} billingData - The billing data to be verified, which should be an object with key:value pairs.
	 */
	async verifyAccountData( name, type, billingData ) {
		await allure.step( 'Verify account data', async () => {
			if ( typeof name === 'string' && name.trim().length > 0 ) {
				await allure.step( 'Verify account name is ' + name, async () => {
					this.accountName = this.page.locator( "//*[@field-label='Account Name']//dd//*[text()='" + name + "']" );
					await expect( this.accountName ).toBeVisible();
				});
			}

			if ( typeof type === 'string' && type.trim().length > 0 ) {
				await allure.step( 'Verify account type is ' + type, async () => {
					//this.accountType = this.page.locator("//*[@field-label='Account Record Type']//dd//*[text()='" + type + "']");
					this.accountType = this.page.locator( "//p[@title='Type']//parent::div//lightning-formatted-text" );
					await expect( this.accountType ).toHaveText( type );
				});
			}

			if ( billingData ) {
				if ( typeof billingData.billingStreet === 'string' && billingData.billingStreet.trim().length > 0 ) {
					await allure.step( 'Verify billing street value is ' + billingData.billingStreet, async () => {
						this.billingStreet = this.page.locator( "//*[@field-label='Billing Address']//dd//*[contains(text(),'" + billingData.billingStreet + "')]" );
						await expect( this.billingStreet ).toBeVisible();
					});
				}

				if ( typeof billingData.billingPostalCode === 'string' && billingData.billingPostalCode.trim().length > 0 ) {
					await allure.step( 'Verify postal code value is ' + billingData.billingPostalCode, async () => {
						this.billingPostalCode = this.page.locator( "//*[@field-label='Billing Address']//dd//*[contains(text(),'" + billingData.billingPostalCode + "')]" );
						await expect( this.postalCode ).toBeVisible();
					});
				}

				if ( typeof billingData.billingCity === 'string' && billingData.billingCity.trim().length > 0 ) {
					await allure.step( 'Verify city value is ' + billingData.billingCity, async () => {
						this.billingCity = this.page.locator( "//*[@field-label='Billing Address']//dd//*[contains(text(),'" + billingData.billingCity + "')]" );
						await expect( this.billingCity ).toBeVisible();
					});
				}

				if ( typeof billingData.billingProvince === 'string' && billingData.billingProvince.trim().length > 0 ) {
					await allure.step( 'Verify province value is ' + billingData.billingProvince, async () => {
						this.billingProvince = this.page.locator( "//*[@field-label='Billing Address']//dd//*[contains(text(),'" + billingData.billingProvince + "')]" );
						await expect( this.billingProvince ).toBeVisible();
					});
				}

				if ( typeof billingData.billingCountry === 'string' && billingData.billingCountry.trim().length > 0 ) {
					await allure.step( 'Verify country value is ' + billingData.billingCountry, async () => {
						this.billingCountry = this.page.locator( "//*[@field-label='Billing Address']//dd//*[contains(text(),'" + billingData.billingCountry + "')]" );
						await expect( this.billingCountry ).toBeVisible();
					});
				}
			}
		});
	}
}
