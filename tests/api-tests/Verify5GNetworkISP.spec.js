import { expect, request, test } from '@playwright/test';
import { allure } from 'allure-playwright';

import { VerifyProduct } from '../../api-pages/products-api-page/VerifyProduct';

/**
 * **[Test Method]** - Verify details of product '5G Network - ISP'
 *
 * *Test Method functionality* :
 * - This method has functionality to verify that product '5G Network - ISP' exists, and to check it's product details.
 *
 * *Steps of this scenario* :
 * 1. Verify product with name '5G Network - ISP' and product code "5G-pro-ISP" exists.
 * 2. Verify product details.
 * 3. Verify reccurring charges.
 */
export async function verify5GNetworkISP() {
	test( 'API-Verify5GNetworkISP', async ({ request }) => {
		allure.description( "Verify that product '5G Network - ISP' exists, and verify product details" );

		// npx eslint --cache --cache-location .eslintcache .  // Lint with caching enabled
		// npx eslint --clear-cache
		// Values for methods
		let productName = '5G Network - ISP';
		let productCode = '5G-pro-Isp';
		let productDetails = {
			Name: productName,
			ProductCode: productCode,
			Charging__c: 'Advanced',
			PackageType: 'ISP',
		};
		let productPricingVariable = 'Recurring';

		// Objects of pages
		const verifyProduct = new VerifyProduct( request );

		// Step 1:
		await verifyProduct.verifyProductExists( productName, productCode, false );

		// Step 2:
		await verifyProduct.verifyProductDetails( process.env.CURRENT_PRODUCT_URL, productDetails );

		// Step 3:
		console.log( 'name change' );
	});
}
