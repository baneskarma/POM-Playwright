import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Verifications } from "../verifications/Verifications";

/**
 * **PAGES : CPQ : ACCOUNTS** [Create]: Create New Account
 */
export class CreateAccount {
  constructor( request ) {
    this.request = request;
    this.verifications = new Verifications( this.request );
  }

  /**
   * **[Method]** - Create new account
   *
   * *Method functionality* :
   * - This method has functionality to create an account with the specified name and type.
   *   Next it will verify that the account is successfully created with the correct data.
   *   It also stores the id and url from the created account in environment variables. process.env.currentAccountUrl and process.env.accountId
   *
   * @param {string} typeValue - The type of the account
   * @param {string} nameValue - The name of the account
   */
  async newAccount( typeValue, nameValue ) {
    await allure.step( "Create new account", async () => {
      let response;
      let accountUrl;
      let accountData;

      await allure.step( "Store Account Data", async () => {
        accountData = {
          type: typeValue,
          name: nameValue,
        };
      });

      try {
        response = await this.request.post( process.env.commonAccountUrl, {
          headers: {
            Authorization: `Bearer ${process.env.sfAccessToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify( accountData ),
        });

        // const headersArray = await response.headersArray();
        // const headers = await response.headers();
        //console.log(headersArray);
        await this.verifications.verifyResponse( response, 201 );

        await allure.step( "Retrieving response data", async () => {
          const responseData = await response.json();
          console.log(
            "Response from creating account is Success:",
            responseData,
          );

          await allure.step( "Store Account ID", async () => {
            const accountId = await responseData.id;
            process.env.accountId = accountId;
            // process.env[`accountId_${process.pid}`] = accountId;
            //console.log("Account ID: " + process.env.accountId);
          });

          await allure.step( "Store Account Url", async () => {
            accountUrl = process.env.commonAccountUrl + process.env.accountId;
            process.env.currentAccountUrl = accountUrl;
          });
        });

        await this.verifications.verifyObjectIdAndData(
          "Account",
          process.env.accountId,
          process.env.currentAccountUrl,
          accountData,
        );
      } catch ( error ) {
        console.error( "Account creation failed:", error );
        throw error;
      }
    });
  }
}
