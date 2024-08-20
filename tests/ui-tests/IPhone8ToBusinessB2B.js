import { allure } from 'allure-playwright';
import { homePage, createAccount, updateAccount, createOrder } from '../../tests-configuration/TestsConfig.mjs';
//import { homePage, createAccount, updateAccount, createOrder } from '../tests-configuration/Fixtures.js';
import { expect, test } from '@playwright/test';

/**
 * <b>[Test Method]</b> - Add 'Apple iPhone 8' to business account with B2B product price list <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to add product 'Apple iPhone 8' to business account with B2B product price list <br>
 * <i>Steps of this scenario:</i><br>
 * 1. If not on wanted homepage go to it. <br>
 * 2. Create new business account. <br>
 * 3. Update the account with billing street and billing city. <br>
 * 4. Create an order for the account with B2B Price List. <br>
 * 5. Add product 'Apple iPhone 8' to the order, set the quantity, unit price and check total charges. <br>
 */
export async function iPhone8ToBusinessB2B() {
	test( 'IPhone8ToBusinessB2B', async () => {
		allure.description( "Add product 'Apple iPhone 8' to business account with B2B product price list" );

		// Values for methods
		let appName = 'Configure Price Quote (CPQ)';
		let tabName1 = 'Accounts';
		let acccountType = 'Business';
		let accountName = 'Blagoja7';
		let billingStreet = 'Venjamin Machukovski';
		let billingCity = 'Skopje';
		let tabName2 = 'Orders';
		let orderStartDate = '20.07.2023';
		let orderPriceList = 'B2B Product Price List';
		let productName = 'Apple iPhone 8';
		let quantity = '3';
		let unitPrice = '20';
		let totalCharges = ( parseInt( quantity ) * parseInt( unitPrice ) ).toString();
		let title = 'Recently Viewed | Accounts | Salesforce';

		// Step 1:
		await homePage.checkHomepage( appName );

		// Step 2:
		await homePage.goToTab( tabName1 );
		await homePage.checkTitle( title );
		await createAccount.newAccount( acccountType, accountName );

		// Step 3:
		await homePage.goToTab( tabName1 );
		await updateAccount.searchAccount( accountName );
		await updateAccount.billingAddress( billingStreet, null, billingCity, ' ', '' );

		// Step 4:
		await homePage.goToTab( tabName2 );
		await createOrder.newOrder( accountName, orderStartDate, orderPriceList );

		// Step 5:
		await createOrder.addProductToOrder( productName, quantity, unitPrice, totalCharges );
		await createOrder.createAsset();
	});
}
