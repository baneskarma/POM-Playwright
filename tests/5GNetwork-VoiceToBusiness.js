import { homePage, createAccount, createOrder, } from '../tests-configuration/TestsConfig.mjs';
import { expect, test } from '@playwright/test';
import { allure } from 'allure-playwright';

//import { test, expect } from "../tests-configuration/Fixtures.mjs"
//import { homePage, createAccount, createOrder } from "../tests-configuration/Fixtures.js"

/**
 * <b>[Test Method]</b> - Order '5G Network - Voice' through business account with B2B product price list <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to order product '5G Network - Voice' through business account with B2B product price list <br>
 * <i>Steps of this scenario:</i><br>
 * 1. If not on wanted homepage go to it. <br>
 * 2. Create new business account. <br>
 * 3. Create an order for the account with B2B Price List. <br>
 * 4. Configure the order and Verify recurring charges.
 * 5. Submit order and check if product is in the account. <br>
 */
export async function order5GNetworkVoiceToBusiness() {
    test("5GNetwork-VoiceToBusiness", async (/**{homePage, createAccount, createOrder}*/) => {
        
        allure.description("Order product '5G Network - Voice' through business account with B2B product price list.");

        // Values for methods
        let appName = "Configure Price Quote (CPQ)";
        let tabName1 = "Accounts";
        let acccountType = "Business";
        let accountName = "Blagoja3";
        let tabName2 = "Orders";
        let orderStartDate = "20.07.2023";
        let orderPriceList = "B2B Product Price List";
        let productName = "5G Network - Voice";
        let quantity = "1";
        let recurringCharges = "20";
        let chargesType = "Recurring Total";
        let totalCharges = (parseInt(quantity) * parseInt(recurringCharges)).toString();
        let title = "Recently Viewed | Accounts | Salesforce";

        // Step 1:
        await homePage.checkHomepage( appName );
 
        // Step 2:
        await homePage.goToTab( tabName1 );
        await homePage.checkTitle(title);
        await createAccount.newAccount( acccountType, accountName );

        // Step 3:
        await homePage.goToTab( tabName2 );
        await createOrder.newOrder( accountName, orderStartDate, orderPriceList );

        // Step 4:
        await createOrder.configureOrder( productName, quantity, chargesType, totalCharges );

        // Step 5:
        await createOrder.submitOrder();
        await createOrder.checkProductInAccount( productName );
    });
};
