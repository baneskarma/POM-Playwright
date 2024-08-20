import { allure } from 'allure-playwright';
import { homePage, vlocityProductConsole } from '../../tests-configuration/TestsConfig.mjs';
//import { homePage, vlocityProductConsole } from '../tests-configuration/Fixtures.js';
import { expect, test } from '@playwright/test';

/**
 * <b>[Test Method]</b> - Verify details of product '10Times 10GB National 150kr' <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to verify that product '10Times 10GB National 150kr' exists, and to check it's product details and child products. <br>
 * <i>Steps of this scenario:</i><br>
 * 1. If not on wanted homepage(CPQ) go to it. <br>
 * 2. Go to Vlocity Product Console, verify the product exists and open it. <br>
 * 3. Verify product details - Name: 10Times 10GB National 150kr, Product family: Bundle, Package Type: Voice, Customer Type: Business, Charging: Advanced. <br>
 * 4. Verify child products. <br>
 */
export async function verify10Times10GBNational150kr() {
	test( 'Verify10Times10GBNational150kr', async () => {
		allure.description( "Verify that product '10Times 10GB National 150kr' exists, and to verify product details and it's child products" );

		// Values for methods
		let appName = 'Configure Price Quote (CPQ)';
		let tabName1 = 'Vlocity Product Console';
		let itemType = 'Product';
		let productName = '10Times 10GB National 150kr';
		let productCode = 'OFF-10TIMES-10GB-NATIONAL';
		let productDetails = {
			// Object that uses field name as key, and field value as value for the object
			Name: '10Times 10GB National 150kr',
			'Product Family': 'Bundle',
			'Customer Type': 'Business',
			Charging: 'Advanced',
			'Package Type': 'Voice',
		};
		let sectionName = 'Product Structure';
		const childProductNames = [ 'Free National Mobile & Fixed Calls - 600min', 'Free National Data - 100GB', 'Free 100 SMS & MMS' ];
		let title = 'Vlocity Product Console | Salesforce';

		// Step 1:
		await homePage.checkHomepage( appName );

		// Step 2:
		await homePage.goToTab( tabName1 );
		await homePage.checkTitle( title );
		await vlocityProductConsole.searchItem( itemType, productName );
		await vlocityProductConsole.openProduct( productName, productCode );

		// Step 3:
		await vlocityProductConsole.verifyProductDetails( productDetails );

		// Step 4:
		await vlocityProductConsole.gotoSection( sectionName );
		await vlocityProductConsole.verifyChildProducts( childProductNames );
	});
}
