import { expect, request, test } from '@playwright/test';
// import { getAccessToken } from '../../tests-configuration/api-config/authentication.js';
import { allure } from 'allure-playwright';
import { CreateAccount } from '../../api-pages/accounts-api-page/CreateAccount';
import { UpdateAccount } from '../../api-pages/accounts-api-page/UpdateAccount';
import { CreateOrder } from '../../api-pages/orders-api-page/CreateOrder';
import { CreateAsset } from '../../api-pages/assets-api-page/CreateAsset';

/**
 * **[Test Method]** - Order '5G Network - Voice' through business account with B2B product price list
 *
 * *Test Method functionality* :
 * - This method has functionality to order product '5G Network - Voice' through business account with B2B product price list <br>
 *
 * *Steps of this scenario* :
 * 1. Create Business account and verify it's creation and data.
 * 2. Create an order for the created account with B2B Price List.
 * 3. Add product '5G Network - Voice' to the order, set the quantity, unit price and check total charges.
 * 4. Create an asset for the created account, with the product '5G Network - Voice' and the ordered quantity, and set the same unit price.
 * 5. Activate the order.
 */
export async function order5GNetworkVoiceToBusiness() {
	test( 'API-5GNetwork-VoiceToBusiness', async ({ request }) => {
		allure.description( "Order product '5G Network - Voice' through business account with B2B product price list." );

		// Variable Values
		let accountType = 'Business';
		let accountName = 'Blagoja80';
		let orderStartDate = '2023-07-20'; // format: YYYY-MM-DD
		let orderPriceList = 'B2B Product Price List';
		let orderStatus = 'Draft';
		let productName = '5G Network - Voice';
		let quantity = '1';
		let unitPrice = '20';
		let orderStatusChange = 'Activated';

		// Objects of pages
		const createAccount = new CreateAccount( request );
		const updateAccount = new UpdateAccount( request );
		const createOrder = new CreateOrder( request );
		const createAsset = new CreateAsset( request );

		// Step 1:
		await createAccount.newAccount( accountType, accountName );

		// Step 2:
		await createOrder.newOrder( process.env.ACCOUNT_ID, orderStartDate, orderPriceList, orderStatus );

		// Step 3:
		await createOrder.createOrderItem( process.env.ORDER_ID, productName, quantity, unitPrice );

		// Step 4:
		await createAsset.newAsset( process.env.ACCOUNT_ID, productName, unitPrice, quantity );

		// Step 5:
		await createOrder.changeOrderStatus( orderStatusChange, process.env.CURRENT_ORDER_URL );
	});
}
