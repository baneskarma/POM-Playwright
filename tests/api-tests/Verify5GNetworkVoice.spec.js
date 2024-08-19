import { expect, request, test } from '@playwright/test';
import { allure } from 'allure-playwright';

import { VerifyProduct } from '../../api-pages/products-api-page/VerifyProduct';

/**
 * **[Test Method]** - Verify details of product '5G Network - Voice'
 *
 * *Test Method functionality* :
 * - This method has functionality to verify that product '5G Network - Voice' exists, and to check it's product details.
 *
 * *Steps of this scenario* :
 * 1. Verify product with name '5G Network - Voice' and product code "PRD_5G_NETWORK_VOICE" exists.
 * 2. Verify product details.
 * 3. Verify recurring charges.
 */
export async function verify5GNetworkVoice() {
	test( 'API-Verify5GNetworkVoice', async ({ request }) => {
		allure.description( "Verify that product '5G Network - Voice' exists, and verify product details" );

		// Values for methods
		let productName = '5G Network - Voice';
		let productCode = 'PRD_5G_NETWORK_VOICE';
		let productDetails = {
			Name: productName,
			ProductCode: productCode,
			Charging__c: 'Advanced',
			PackageType: 'Voice',
		};
		let productPricingVariable = 'Recurring';

		// Objects of pages
		const verifyProduct = new VerifyProduct( request );

		// Step 1:
		await verifyProduct.verifyProductExists( productName, productCode, false );

		// Step 2:
		await verifyProduct.verifyProductDetails( process.env.CURRENT_PRODUCT_URL, productDetails );

		// Step 3:
	});
}
