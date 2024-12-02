import { test } from '@playwright/test';
import { page } from '../../tests-configuration/TestsConfig.mjs';
// api imports
import { allure } from 'allure-playwright';
import { CreateAccount } from '../../api-pages/accounts-api-page/CreateAccount';
import { CreateOrder } from '../../api-pages/orders-api-page/CreateOrder';
import { CreateAsset } from '../../api-pages/assets-api-page/CreateAsset';
// ui imports
import { HomePage } from '../../pages/home-page/HomePage';
import { UpdateAccount } from '../../pages/accounts-page/UpdateAccount';
import { VerifyAccount } from '../../pages/accounts-page/VerifyAccount';
import { VerifyOrder } from '../../pages/orders-page/VerifyOrder';

/**
 * **[Test Method]** - Order '5G Network - Voice' through business account with B2B product price list
 *
 * *Test Method functionality* :
 * - This method has functionality to order product '5G Network - Voice' through business account with B2B product price list <br>
 *
 * *Steps of this scenario* :
 * 1. Create Business account through api, and verify it's creation and data in ui.
 * 2. Create an order for the created account with B2B Price List through api. Verify the order's data in ui.
 * 3. Add product '5G Network - Voice' to the order, set the quantity, unit price and check total charges through api. Verify the added product through ui.
 * 4. Create an asset for the created account, with the product '5G Network - Voice' and the ordered quantity, and set the same unit price.
 * 5. Activate the order through api. Verify the activation through ui.
 */
export async function order5GNetworkVoiceToBusiness() {
	test( 'HYBRID-A5GNetworkVoiceToBusiness', async ({ request }) => {
		allure.description( "Order product '5G Network - Voice' through business account with B2B product price list." );

		// Values for api methods
		let accountType = 'Business';
		let accountName = 'Blagoja80';
		let orderStartDate = '2023-07-20'; // format: YYYY-MM-DD
		let orderPriceList = 'B2B Product Price List';
		let orderStatus = 'Draft';
		let productName = '5G Network - Voice';
		let quantity = '1';
		let unitPrice = '20';
		let orderStatusChange = 'Activated';

		// Values for ui methods
		let appName = 'Configure Price Quote (CPQ)';
		let tabName1 = 'Accounts';
		let title = 'Recently Viewed | Accounts | Salesforce';
		let tabName2 = 'Orders';
		let title2 = 'Recently Viewed | Orders | Salesforce';

		// Objects of api pages
		const createAccount = new CreateAccount( request );
		const createOrder = new CreateOrder( request );
		const createAsset = new CreateAsset( request );
		// objects of ui pages
		const homePage = new HomePage( page );
		const updateAccount = new UpdateAccount( page );
		const verifyAccount = new VerifyAccount( page );
		const verifyOrder = new VerifyOrder( page );

		// Step 1:
		await createAccount.newAccount( accountType, accountName );
		await homePage.checkHomepage( appName );
		await homePage.goToTab( tabName1 );
		await homePage.checkTitle( title );
		await updateAccount.searchAccount( accountName );
		await verifyAccount.verifyAccountData( accountName, accountType, null );

		// Step 2:
		await createOrder.newOrder( process.env.ACCOUNT_ID, orderStartDate, orderPriceList, orderStatus );
		await homePage.goToTab( tabName2 );
		await homePage.checkTitle( title2 );
		await verifyOrder.searchOrder( process.env.ORDER_ID );
		await verifyOrder.verifyOrderDetails( accountName, orderPriceList, orderStartDate, orderStatus );

		// Step 3:
		await createOrder.createOrderItem( process.env.ORDER_ID, productName, quantity, unitPrice );
		await homePage.refreshPage();
		await verifyOrder.verifyOrderedProductData( productName, quantity, unitPrice );

		// Step 4:
		await createAsset.newAsset( process.env.ACCOUNT_ID, productName, unitPrice, quantity );

		// Step 5:
		await createOrder.changeOrderStatus( orderStatusChange, process.env.CURRENT_ORDER_URL );
		await homePage.refreshPage();
		await verifyOrder.verifyOrderActivation();
	});
}
