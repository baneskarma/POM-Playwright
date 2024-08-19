import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Verifications } from "../verifications/Verifications";

/**
 * **PAGES : CPQ : ACCOUNTS** [Update]: Update Account
 */
export class UpdateAccount {
  constructor( request ) {
    this.request = request;
  }

  /**
   * **[Method]** - Update account's billing address
   *
   * *Method functionality* :
   * - This method has functionality to update the billing address of an existing account.
   *   Next it will verify that the account is successfully updated with the correct billing data.
   *
   * @param {string} accountId - The id of the account
   * @param {string} accountUrl - The url of the account
   * @param {{ billingStreet?: string, billingPostalCode?: string, billingCity?: string, billingProvince?: string, billingCountry?: string }} billingData - The billing data to be updated, which should be an object with key:value pairs.
   */
  async billingAddress( accountId, accountUrl, billingData ) {
    const verifications = new Verifications( this.request );

    await allure.step( "Update account", async () => {
      let updateData = {};

      if (
        typeof billingData.billingStreet === "string" &&
        billingData.billingStreet.trim().length > 0
      ) {
        await allure.step(
          "Add billing street: " + billingData.billingStreet,
          async () => {
            updateData.BillingStreet = billingData.billingStreet;
          },
        );
      }

      if (
        typeof billingData.billingPostalCode === "string" &&
        billingData.billingPostalCode.trim().length > 0
      ) {
        await allure.step(
          "Add billing postal code: " + billingData.billingPostalCode,
          async () => {
            updateData.BillingPostalCode = billingData.billingPostalCode;
          },
        );
      }

      if (
        typeof billingData.billingCity === "string" &&
        billingData.billingCity.trim().length > 0
      ) {
        await allure.step(
          "Add billing city: " + billingData.billingCity,
          async () => {
            updateData.BillingCity = billingData.billingCity;
          },
        );
      }

      if (
        typeof billingData.billingProvince === "string" &&
        billingData.billingProvince.trim().length > 0
      ) {
        await allure.step(
          "Add billing province: " + billingData.billingProvince,
          async () => {
            updateData.BillingProvince = billingData.billingProvince;
          },
        );
      }

      if (
        typeof billingData.billingCountry === "string" &&
        billingData.billingCountry.trim().length > 0
      ) {
        await allure.step(
          "Add billing country: " + billingData.billingCountry,
          async () => {
            updateData.BillingCountry = billingData.billingCountry;
          },
        );
      }

      try {
        const response = await this.request.patch( accountUrl, {
          headers: {
            Authorization: `Bearer ${process.env.sfAccessToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify( updateData ),
        });

        await verifications.verifyResponse( response, 204 );

        const accountData = billingData;
        await verifications.verifyObjectIdAndData(
          "Account",
          accountId,
          accountUrl,
          accountData,
        );
      } catch ( error ) {
        console.error( "Updating account has failed:", error );
        throw error;
      }
    });
  }
}
