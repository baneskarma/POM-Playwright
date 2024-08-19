import { expect, request, test } from "@playwright/test";
// import { getAccessToken } from '../../tests-configuration/api-config/authentication.js';
import { allure } from "allure-playwright";
import { CreateAccount } from "../../api-pages/accounts-api-page/CreateAccount";
import { UpdateAccount } from "../../api-pages/accounts-api-page/UpdateAccount";
import { CreateOrder } from "../../api-pages/orders-api-page/CreateOrder";
import { CreateAsset } from "../../api-pages/assets-api-page/CreateAsset";

/**
 * **[Test Method]** - Add 'Apple iPhone 8' to business account with B2B product price list
 *
 * *Test Method functionality* :
 * - This method has functionality to add product 'Apple iPhone 8' to business account with B2B product price list.
 *
 * *Steps of this scenario* :
 * 1. Create Business account and verify it's creation and data.
 * 2. Update the account  with billing street and billing city, then verify the updated values.
 * 3. Create an order for the created account with B2B Price List.
 * 4. Add product 'Apple iPhone 8' to the order, set the quantity, unit price and check total charges.
 * 5. Create an asset for the created account, with the product 'Apple iPhone 8' and the ordered quantity, and set the same unit price.
 * 6. Activate the order.
 */
export async function iPhone8ToBusinessB2B() {
  test( "API-iPhone8ToBusinessB2B", async ({ request }) => {
    allure.description(
      "Add product 'Apple iPhone 8' to business account with B2B product price list",
    );

    // Variable Values
    let acccountType = "Business";
    let accountName = "Blagoja60";
    let billingData = {
      // This list should contain the values for the fields of the billing address
      billingStreet: "Venjamin Machukovski",
      billingPostalCode: "",
      billingCity: "Skopje",
      billingProvince: "",
      billingCountry: "",
    };
    let orderStartDate = "2023-07-20"; // format: YYYY-MM-DD
    let orderPriceList = "B2B Product Price List";
    let orderStatus = "Draft";
    let productName = "Apple iPhone 8";
    let quantity = "3";
    let unitPrice = "20";
    let orderStatusChange = "Activated";

    // Objects of pages
    const createAccount = new CreateAccount( request );
    const updateAccount = new UpdateAccount( request );
    const createOrder = new CreateOrder( request );
    const createAsset = new CreateAsset( request );

    // Step 1:
    await createAccount.newAccount( acccountType, accountName );

    // Step 2:
    await updateAccount.billingAddress(
      process.env.accountId,
      process.env.currentAccountUrl,
      billingData,
    );

    // Step 3:
    await createOrder.newOrder(
      process.env.accountId,
      orderStartDate,
      orderPriceList,
      orderStatus,
    );

    // Step 4:
    await createOrder.createOrderItem(
      process.env.orderId,
      productName,
      quantity,
      unitPrice,
    );

    // Step 5:
    await createAsset.newAsset(
      process.env.accountId,
      productName,
      unitPrice,
      quantity,
    );

    // Step 6:
    await createOrder.changeOrderStatus(
      orderStatusChange,
      process.env.currentOrderUrl,
    );
  });
}
