import { expect, request, test } from '@playwright/test';
// import { getAccessToken } from '../../tests-configuration/api-config/authentication.js';
import { allure } from 'allure-playwright';
import { CreateAccount } from '../../api-pages/accounts-api-page/CreateAccount';
import { UpdateAccount } from '../../api-pages/accounts-api-page/UpdateAccount';
import { CreateOrder } from '../../api-pages/orders-api-page/CreateOrder';
import { CreateAsset } from '../../api-pages/assets-api-page/CreateAsset';

/**
 * **[Test Method]** - Add 'Apple iPhone 7' to consumer account with B2C product price list
 *
 * *Test Method functionality* :
 * - This method has functionality to add product 'Apple iPhone 7' to consumer account with B2C product price list.
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
	test( 'API-iPhone7ToConsumerB2C', async ({ request }) => {
		allure.description( "API - Add 'Apple iPhone 7' to consumer account with B2C product price list" );

		// Variable Values
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

		// Objects of pages
		const createAccount = new CreateAccount( request );
		const updateAccount = new UpdateAccount( request );
		const createOrder = new CreateOrder( request );
		const createAsset = new CreateAsset( request );

		// Step 1:
		await createAccount.newAccount( accountType, accountName );

		// Step 2:
		await updateAccount.billingAddress( process.env.ACCOUNT_ID, process.env.CURRENT_ACCOUNT_URL, billingData );

		// Step 3:
		await createOrder.newOrder( process.env.ACCOUNT_ID, orderStartDate, orderPriceList, orderStatus );

		// Step 4:
		await createOrder.createOrderItem( process.env.ORDER_ID, productName, quantity, unitPrice );

		// Step 5:
		await createAsset.newAsset( process.env.ACCOUNT_ID, productName, unitPrice, quantity );

		// Step 6:
		await createOrder.changeOrderStatus( orderStatusNewValue, process.env.CURRENT_ORDER_URL );
	});
}
