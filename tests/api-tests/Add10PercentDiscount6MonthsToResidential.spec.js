import { expect, request, test } from "@playwright/test";
// import { getAccessToken } from '../../tests-configuration/api-config/authentication.js';
import { allure } from "allure-playwright";
import { CreateAccount } from "../../api-pages/accounts-api-page/CreateAccount";
import { UpdateAccount } from "../../api-pages/accounts-api-page/UpdateAccount";
import { CreateOrder } from "../../api-pages/orders-api-page/CreateOrder";
import { CreateAsset } from "../../api-pages/assets-api-page/CreateAsset";

/**
 * **[Test Method]** - Add 'Add '10% Discount - 6 months' to Residential account
 *
 * *Test Method functionality* :
 * - This method has functionality to add discount 'Add '10% Discount - 6 months' for any product available, to a Residential account, and verify the discount duration and percentage. <br>
 *
 * *Steps of this scenario* :
 * 1. Create Residential account and verify it's creation and data.
 * 2. Create an order for the created account with B2C Price List.
 * 3. Add the discount '10% Discount - 6 months', and verify it's duration and percentage.
 * 4. Add product '5G Network - Voice' to the order, set the quantity, unit price and check total charges.
 * 5. Create an asset for the created account, with the product '5G Network - Voice' and the ordered quantity, and set the same unit price.
 * 6. Activate the order.
 */
export async function add10PercentDiscount6MonthsToResidential() {
  test( "API-add10PercentDiscount6MonthsToResidential", async ({ request }) => {
    allure.description(
      "Add discount 'Add '10% Discount - 6 months' for any product available, to a Residential account, and verify the discount duration and percentage",
    );

    // Variable Values
    let acccountType = "Residential";
    let accountName = "Blagoja70";
    let orderStartDate = "2023-07-10"; // 10th of July 2023 with format: YYYY-MM-DD
    let orderPriceList = "B2C Product Price List";
    let orderStatus = "Draft";
    let discountName = "10% Discount - 6 months";
    let productName = "5G Network - Voice";
    let quantity = "1";
    let unitPrice = "30";
    let orderStatusChange = "Activated";

    // Objects of pages
    const createAccount = new CreateAccount( request );
    const updateAccount = new UpdateAccount( request );
    const createOrder = new CreateOrder( request );
    const createAsset = new CreateAsset( request );

    // Step 1:
    await createAccount.newAccount( acccountType, accountName );

    // Step 2:
    await createOrder.newOrder(
      process.env.accountId,
      orderStartDate,
      orderPriceList,
      orderStatus,
    );

    // Step 3:
    await createOrder.createOrderItem(
      process.env.orderId,
      productName,
      quantity,
      unitPrice,
    );

    // Step 4:
    await createAsset.newAsset(
      process.env.accountId,
      productName,
      unitPrice,
      quantity,
    );

    // Step 5:
    await createOrder.changeOrderStatus(
      orderStatusChange,
      process.env.currentOrderUrl,
    );
  });
}
