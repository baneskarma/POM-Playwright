import { allure } from 'allure-playwright';
import { homePage, vlocityProductConsole, page } from '../tests-configuration/TestsConfig.mjs';
//import { homePage, vlocityProductConsole } from '../tests-configuration/Fixtures.js';
import { expect, test } from '@playwright/test';
import { ai } from '@zerostep/playwright';


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
export async function zeroStepDemo() {
    test("ZeroStepDemo", async () => {

        allure.description("Verify that product '10Times 10GB National 150kr' exists, and to verify product details and it's child products");

        // Values for methods
        let appName = "Configure Price Quote (CPQ)";
        let tabName1 = "Vlocity Product Console";
        let itemType = "Product"
        let productName = "10Times 10GB National 150kr";
        let productCode = "OFF-10TIMES-10GB-NATIONAL";
        let productDetails = {
            // Object that uses field name as key, and field value as value for the object
            "Name": "10Times 10GB National 150kr",
            "Product Family": "Bundle",
            "Customer Type": "Business",
            "Charging": "Advanced",
            "Package Type": "Voice",
        };
        let sectionName = "Product Structure";
        const childProductNames = [
            "Free National Mobile & Fixed Calls - 600min",
            "Free National Data - 100GB",
            "Free 100 SMS & MMS"
        ];
        let title = "Vlocity Product Console | Salesforce"

        // Step 1:
        await homePage.checkHomepage( appName );

        // Step 2:
        await ai("Click the 'Vlocity Product Console' link, and wait for the page to fully load", {test, page});
        
        //await ai("Inside the iframe, Click the first icon inside the element with text 'Product'", {test, page});
        await vlocityProductConsole.searchItem(itemType, productName);
        //await ai("On the input field with placeholder 'Search Product..', write '10Times 10GB National 150kr', and click enter", {test, page});       
        await ai("On the table if there is a row with exact product name '10Times 10GB National 150kr' and on the same row it has column with this exact product code '1OFF-10TIMES-10GB-NATIONAL', click that row product name link", {test, page});

        // Step 3:

        await ai("Click the dropdown next to 'Customer Type', and choose 'Residential'", {test, page});

        await ai("Scroll down until field 'Not Assetizable' is into view", {test, page});

        await ai("Click the checkbox next to 'Not Assetizable'", {test, page});

        await ai("Scroll down until the end of the page", {test, page});

        await ai("To the DATETIME field, next to 'Selling End Date' write the value '02/05/2023', and click enter.", {test, page});
        
        //await ai("For date choose 'February 5 2023'", {test, page});
        await page.pause();
        //await vlocityProductConsole.verifyProductDetails( productDetails );

        // Step 4:
        await vlocityProductConsole.gotoSection( sectionName );
        await vlocityProductConsole.verifyChildProducts( childProductNames );
    });
};
