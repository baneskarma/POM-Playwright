import { allure } from 'allure-playwright';
import { homePage, vlocityProductConsole } from '../tests-configuration/TestsConfig.mjs';
//import { homePage, vlocityProductConsole } from '../tests-configuration/Fixtures.js';
import { expect, test } from '@playwright/test';


/**
 * <b>[Test Method]</b> - Verify details of product '5G Network - ISP' <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to verify that product '5G Network - ISP' exists, and to check it's product details <br>
 * <i>Steps of this scenario:</i><br>
 * 1. If not on wanted homepage(CPQ) go to it. <br>
 * 2. Go to Vlocity Product Console, verify the product exists and open it. <br>
 * 3. Verify product details - Tariff Type: Recurring, Charging: Advance, Package Type: ISP. <br>
 */
export async function verify5GNetworkISP() {
    test("Verify5GNetworkISP", async () => {

        allure.description("Verify that product '5G Network - ISP' exists, and verify product details");

        // Values for methods
        let appName = "Configure Price Quote (CPQ)";
        let tabName1 = "Vlocity Product Console";
        let itemType = "Product"
        let productName = "5G Network - ISP";
        let productCode = "5G-pro-Isp";
        let productDetails = {
            // Object that uses field name as key, and field value as value for the object
            "Charging": "Advanced",
            "Package Type": "ISP",
        };
        let sectionName = "Pricing";
        let pricingVariable = "Recurring"
        let title = "Vlocity Product Console | Salesforce"

        // Step 1:
        await homePage.checkHomepage( appName );

        // Step 2:
        await homePage.goToTab( tabName1 );
        await homePage.checkTitle(title);
        await vlocityProductConsole.searchItem( itemType, productName );
        await vlocityProductConsole.openProduct( productName, productCode );

        // Step 3:
        await vlocityProductConsole.verifyProductDetails( productDetails );
        await vlocityProductConsole.gotoSection( sectionName );
        await vlocityProductConsole.verifyPricing( pricingVariable )
    });
};
