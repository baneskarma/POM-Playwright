import { expect, request, test } from "@playwright/test";
// import { getAccessToken } from '../../tests-configuration/api-config/authentication.js';
import { allure } from "allure-playwright";

import { VerifyProduct } from "../../api-pages/products-api-page/VerifyProduct";

/**
 * **[Test Method]** - Verify details of product '10Times 10GB National 150kr'
 *
 * *Test Method functionality* :
 * - This method has functionality to verify that product '10Times 10GB National 150kr' exists, and to check it's product details and child products.
 *
 * *Steps of this scenario* :
 * 1. Verify product with name '10Times 10GB National 150kr' and code 'OFF-10TIMES-10GB-NATIONAL' exists. <br>
 * 2. Verify product details. <br>
 * 3. Verify child products of product '10Times 10GB National 150kr'. <br>
 */
export async function verify10Times10GBNational150kr() {
  test( "API-Verify10Times10GBNational150kr", async ({ request }) => {
    allure.description(
      "Verify that product '10Times 10GB National 150kr' exists, and verify the product details and it's child products",
    );

    // Values for methods
    let productName = "10Times 10GB National 150kr";
    let productCode = "OFF-10TIMES-10GB-NATIONAL";
    let productDetails = {
      Name: productName,
      ProductCode: productCode,
      Family: "Bundle",
      Customer_Type__c: "Business",
      Charging__c: "Advanced",
      PackageType: "Voice", // "vlocity_cmt__AttributeDefaultValues__c" "ATT-PKG-TP"
    };

    const childProductNames = [
      "Free National Mobile & Fixed Calls - 600min",
      "Free National Data - 100GB",
      "Free 100 SMS & MMS",
    ];

    const childProductCodes = [
      "PRD-FREE-NATIONAL-MOBILE-&-FIXED-600min",
      "PRD-FREE-NATIONAL-DATA-100GB",
      "PRD-FREE-100-SMS-&-MMS",
    ];

    // Objects of pages
    const verifyProduct = new VerifyProduct( request );

    // Step 1:
    await verifyProduct.verifyProductExists( productName, productCode, false );

    // Step 2:
    await verifyProduct.verifyProductDetails(
      process.env.currentProductUrl,
      productDetails,
    );

    // Step 3:
    await verifyProduct.verifyChildProducts(
      productName,
      process.env.productId,
      childProductNames,
      childProductCodes,
    );
  });
}
