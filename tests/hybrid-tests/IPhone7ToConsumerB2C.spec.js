import { test } from '@playwright/test';
import { page } from '../../tests-configuration/TestsConfig.mjs';
// api imports
import { allure } from 'allure-playwright';
import { CreateAccount } from '../../api-pages/accounts-api-page/CreateAccount';
import { UpdateAccount } from '../../api-pages/accounts-api-page/UpdateAccount';
import { CreateOrder } from '../../api-pages/orders-api-page/CreateOrder';
import { CreateAsset } from '../../api-pages/assets-api-page/CreateAsset';
// ui imports
import { HomePage } from '../../pages/home-page/HomePage';
import { VerifyAccount } from '../../pages/accounts-page/VerifyAccount';
import { VerifyOrder } from '../../pages/orders-page/VerifyOrder';
import { UpdateAccount as UpdateAccountUI } from '../../pages/accounts-page/UpdateAccount';

/**
 * **[Test Method]** - Add 'Apple iPhone 7' to consumer account with B2C product price list
 *
 * *Test Method functionality* :
 * - This method has functionality to add product 'Apple iPhone 7' to consumer account with B2C product price list through API, and verify the creations through UI.
 *
 * *Steps of this scenario* :
 * 1. Create consumer account and verify it's creation and data.
 * 2. Update the account  with billing street and billing city, then verify the updated values.
 * 3. Create an order for the created account with B2C Price List.
 * 4. Add product 'Apple iPhone 7' to the order, set the quantity, unit price and check total charges.
 * 5. Create an asset for the created account, with the product 'Apple iPhone 8' and the ordered quantity, and set the same unit price.
 * 6. Activate the order.
 */
export async function iPhone7ToConsumerB2C() {
	test( 'HYBRID-iPhone7ToConsumerB2C', async ({ request }) => {
		allure.description( "HYBRID - Add 'Apple iPhone 7' to consumer account with B2C product price list" );

		// Variable Values for API
		let accountType = 'Consumer';
		let accountName = 'Blagoja50';
		let billingData = {
			// This list should contain the values for the fields of the billing address
			billingStreet: 'Venjamin Machukovski',
			billingPostalCode: '',
			billingCity: 'Skopje',
			billingProvince: '',
			billingCountry: '',
		};
		let orderStartDate = '2023-07-10'; // 10th of July 2023 with format: YYYY-MM-DD
		let orderPriceList = 'B2C Product Price List';
		let orderStatus = 'Draft';
		let productName = 'Apple iPhone 7';
		let quantity = '2';
		let unitPrice = '50';
		let orderStatusNewValue = 'Activated';

		// Values for UI methods
		let appName = 'Configure Price Quote (CPQ)';
		let tabName1 = 'Accounts';
		let title = 'Recently Viewed | Accounts | Salesforce';
		let tabName2 = 'Orders';
		let title2 = 'Recently Viewed | Orders | Salesforce';

		// Objects of pages
		const createAccount = new CreateAccount( request );
		const updateAccount = new UpdateAccount( request );
		const createOrder = new CreateOrder( request );
		const createAsset = new CreateAsset( request );

		// objects of ui pages
		const homePage = new HomePage( page );
		const updateAccountUI = new UpdateAccountUI( page );
		const verifyAccount = new VerifyAccount( page );
		const verifyOrder = new VerifyOrder( page );

		// Step 1:
		await createAccount.newAccount( accountType, accountName );
		await homePage.checkHomepage( appName );
		await homePage.goToTab( tabName1 );
		await homePage.checkTitle( title );
		await updateAccountUI.searchAccount( accountName );
		await verifyAccount.verifyAccountData( accountName, accountType, null );

		// Step 2:
		await updateAccount.billingAddress( process.env.ACCOUNT_ID, process.env.CURRENT_ACCOUNT_URL, billingData );
		await homePage.refreshPage();
		await verifyAccount.verifyAccountData( null, null, billingData );

		// Step 3:
		await createOrder.newOrder( process.env.ACCOUNT_ID, orderStartDate, orderPriceList, orderStatus );
		await homePage.goToTab( tabName2 );
		await homePage.checkTitle( title2 );
		await verifyOrder.searchOrder( process.env.ORDER_ID );
		await verifyOrder.verifyOrderDetails( accountName, orderPriceList, orderStartDate, orderStatus );

		// Step 4:
		await createOrder.createOrderItem( process.env.ORDER_ID, productName, quantity, unitPrice );
		await homePage.refreshPage();
		await verifyOrder.verifyOrderedProductData( productName, quantity, unitPrice );

		// Step 5:
		await createAsset.newAsset( process.env.ACCOUNT_ID, productName, unitPrice, quantity );

		// Step 6:
		await createOrder.changeOrderStatus( orderStatusNewValue, process.env.CURRENT_ORDER_URL );
		await homePage.refreshPage();
		await verifyOrder.verifyOrderActivation();
	});
}
