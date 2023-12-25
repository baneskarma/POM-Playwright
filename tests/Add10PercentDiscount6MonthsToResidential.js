import { homePage, createAccount, createOrder } from '../tests-configuration/TestsConfig.mjs';
//import { homePage, createAccount, createOrder } from '../tests-configuration/Fixtures.js';
import { expect, test } from '@playwright/test';

//import { test, expect } from "../tests-configuration/Fixtures.mjs"

/**
 * <b>[Test Method]</b> - Add 'Add '10% Discount - 6 months' to Residential account <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to add discount 'Add '10% Discount - 6 months' for any product available, to a Residential account, and verify the discount duration and percentage. <br>
 * <i>Steps of this scenario:</i><br>
 * 1. If not on wanted homepage go to it. <br>
 * 2. Create new Residential account. <br>
 * 3. Create an order for the account with B2C Price List. <br>
 * 4. Configure the order, add any available product to the cart. <br>
 * 5. Add the discount '10% Discount - 6 months', and verify it's duration and percentage. <br>
 * 6. Submit order and check if discount is in the account. <br>
 */
export async function add10PercentDiscount6MonthsToResidential() {
    test("Add '10% Discount - 6 months' to Residential account", async (/**{ homePage, createAccount, createOrder}*/) => {
        // Values for methods
        let appName = "Configure Price Quote (CPQ)";
        let tabName1 = "Accounts";
        let acccountType = "Residential";
        let accountName = "Blagoja4";
        let tabName2 = "Orders";
        let orderStartDate = "10.07.2023";
        let orderPriceList = "B2C Product Price List";
        let productName = "5G Network - Voice";
        let quantity = "1";
        let recurringCharges = "30";
        let chargesType = "Recurring Total";
        let totalCharges = (parseInt(quantity) * parseInt(recurringCharges)).toString();
        let discountName = "10% Discount - 6 months"
        let discountValue = "10%";
        let discountDuration = "TP-6M";  // if discountDuration is for example 3 months, you should put: "TP-3M"
        let title = "Recently Viewed | Accounts | Salesforce"

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
        await createOrder.addDiscount( discountName, discountValue, discountDuration );

        // Step 6:
        await createOrder.submitOrder();
        await createOrder.checkProductInAccount( productName );
        // Check discount in account????????????????
    });
};
