import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Verifications } from "../verifications/Verifications";

/**
 * **PAGES : CPQ : PRODUCTS** [Verify]: Verify Product
 */
export class VerifyProduct {
  constructor( request ) {
    this.request = request;
    this.verifications = new Verifications( this.request );
  }

  /**
   * **[Method]** - Verify that the specified product exists
   *
   * *Method functionality* :
   * - This method has functionality to verify the product name and code, so we can verify that the product exists.
   *   It has a 'childProductBool' boolean variable to specify If it is a child product or not. If it is a child product the method will return the child's productId, otherwise it stores the id and url of the product as environment variables.
   *
   * @param {string} productName - The name of the product
   * @param {string} productCode - The code of the product
   * @param {boolean} childProductBool - To check if it's a child product
   */
  async verifyProductExists( productName, productCode, childProductBool ) {
    let productId;
    let responseData;
    let records;
    await allure.step(
      "Verify product: '" +
        productName +
        "' exists with product code: " +
        productCode,
      async () => {
        try {
          const response = await this.request.get(
            process.env.commonUrl +
              "query?q=SELECT+Name,ProductCode,Id+FROM+Product2",
            {headers: {Authorization: `Bearer ${process.env.sfAccessToken}`,},},
          );

          await allure.step( "Retrieving response data", async () => {
            responseData = await response.json();
            records = responseData.records;
          });

          for ( let i = 0; i < records.length; i++ ) {
            if (
              records[i].Name === productName &&
              records[i].ProductCode === productCode
            ) {
              productId = records[i].Id;

              if ( !childProductBool ) {
                await allure.step(
                  "Store the product's id: " + productId,
                  async () => {
                    process.env.productId = productId;
                    //console.log("The id of product " + productName + " is " + productId);
                  },
                );

                await allure.step( "Store the product url", async () => {
                  process.env.currentProductUrl =
                    process.env.commonProductUrl + process.env.productId;
                });
              } else {
                await allure.step(
                  "Return the child product's id: " + productId,
                  async () => {
                    return productId;
                  },
                );
              }

              break;
            } else if ( i === records.length - 1 ) {
              throw new Error(
                "There is no product with name: '" +
                  productName +
                  "', and product code: " +
                  productCode,
              );
            }
          }
        } catch ( error ) {
          await allure.step(
            "Verifying existence of product has failed: " + error,
            async () => {
              throw error;
            },
          );
          // console.error('Verifying existence of product has failed:', error);
          // throw error;
        }
      },
    );

    if ( childProductBool ) {
      return productId;
    }
  }

  /**
   * **[Method]** - Verify Product Details
   *
   * *Method functionality*:
   * - This method has functionality to verify the values for the product api fields we specify in the object productData.
   * If package type is needed to be verified, use PackageType as key in the productData object.
   *
   * @param {{Name: string, ProductCode: string, Family?: string, Customer_Type__c?: string, Charging__c?: string, PackageType?: string}} productData - Object that contains the api field names as keys of the object, and the field values as the values of the keys for the object
   * @param {string} productUrl - String that contains the url of the product we want to verify.
   */
  async verifyProductDetails( productUrl, productData ) {
    await allure.step(
      "Verify details of product: " + productData.Name,
      async () => {
        let responseData;
        try {
          const response = await this.request.get( productUrl, {headers: {Authorization: `Bearer ${process.env.sfAccessToken}`,},});

          await this.verifications.verifyResponse( response, 200 );

          await allure.step( "Retrieving response data", async () => {
            responseData = await response.json();
            //console.log('Response from product:', responseData);
          });

          if (
            typeof productData.Name === "string" &&
            productData.Name.trim().length > 0
          ) {
            await allure.step(
              "Verify product's name is: " + productData.Name,
              async () => {
                expect( responseData.Name ).toBe( productData.Name );
              },
            );
          }

          if (
            typeof productData.ProductCode === "string" &&
            productData.ProductCode.trim().length > 0
          ) {
            await allure.step(
              "Verify product's code is: " + productData.ProductCode,
              async () => {
                expect( responseData.ProductCode ).toBe( productData.ProductCode );
              },
            );
          }

          if (
            typeof productData.Family === "string" &&
            productData.Family.trim().length > 0
          ) {
            await allure.step(
              "Verify product family is: " + productData.Family,
              async () => {
                expect( responseData.Family ).toBe( productData.Family );
              },
            );
          }

          if (
            typeof productData.Customer_Type__c === "string" &&
            productData.Customer_Type__c.trim().length > 0
          ) {
            await allure.step(
              "Verify product's customer type is: " +
                productData.Customer_Type__c,
              async () => {
                expect( responseData.Customer_Type__c ).toBe(
                  productData.Customer_Type__c,
                );
              },
            );
          }

          if (
            typeof productData.Charging__c === "string" &&
            productData.Charging__c.trim().length > 0
          ) {
            await allure.step(
              "Verify product's charging is: " + productData.Charging__c,
              async () => {
                expect( responseData.Charging__c ).toBe( productData.Charging__c );
              },
            );
          }

          if (
            typeof productData.PackageType === "string" &&
            productData.PackageType.trim().length > 0
          ) {
            await allure.step(
              "Verify product's package type is: " + productData.PackageType,
              async () => {
                //const responseAttributes = await responseData.vlocity_cmt__AttributeDefaultValues__c;
                const responseAttributes = await JSON.parse(
                  responseData.vlocity_cmt__AttributeDefaultValues__c,
                );
                //console.log(responseAttributes);
                const packageType = responseAttributes["ATT-PKG-TP"];
                //console.log(packageType);
                expect( packageType ).toBe( productData.PackageType );
              },
            );
          }
        } catch ( error ) {
          await allure.step(
            "Verifying details of product failed: " + error,
            async () => {
              throw error;
            },
          );
          // console.error('Verifying details of product failed:', error);
          // throw error;
        }
      },
    );
  }

  /**
   * **[Method]** - Verify child products
   *
   * *Method functionality* :
   * - This method has functionality to verify that the specified child products exist as products.
   * Then it verifies that there are child product items from the verified child products, with the child product id's as child products, and the parent product id as the parent product.
   *
   * @param {string} parentProductName - The name of the parent product
   * @param {string} parentProductId - The code of the parent product
   * @param {string[]} childProductNames - List containing the child product names
   * @param {Array.<string>} childProductCodes - List containing the child product codes
   */
  async verifyChildProducts(
    parentProductName,
    parentProductId,
    childProductNames,
    childProductCodes,
  ) {
    await allure.step(
      "Verify child products for product: " + parentProductName,
      async () => {
        let currentChildProductName;
        let currentChildProductCode;
        let childProductId;
        let childProductIds = [];
        let responseData;
        let records;
        try {
          await allure.step( "Verify child products existence", async () => {
            for ( let i = 0; i < childProductNames.length; i++ ) {
              currentChildProductName = childProductNames[i];
              currentChildProductCode = childProductCodes[i];
              childProductId = await this.verifyProductExists(
                currentChildProductName,
                currentChildProductCode,
                true,
              );
              childProductIds.push( childProductId );
            }
          });

          await allure.step( "Get all child product items", async () => {
            const response = await this.request.get(
              process.env.commonUrl +
                "query?q=SELECT+vlocity_cmt__ChildProductId__c,vlocity_cmt__ParentProductId__c,vlocity_cmt__ChildProductName__c,vlocity_cmt__ParentProductName__c+FROM+vlocity_cmt__ProductChildItem__c",
              {headers: {Authorization: `Bearer ${process.env.sfAccessToken}`,},},
            );

            await this.verifications.verifyResponse( response, 200 );

            await allure.step( "Store the data from the response", async () => {
              responseData = await response.json();
              records = responseData.records;
              // console.log("5119 Number of child product items: " + records.length);
            });
          });

          for ( let i = 0; i < childProductIds.length; i++ ) {
            const currentChildProductName = childProductNames[i];
            const currentChildProductId = childProductIds[i];

            await allure.step(
              "Verify product '" +
                currentChildProductName +
                "', is a child product of " +
                parentProductName,
              async () => {
                for ( let j = 0; j < records.length; j++ ) {
                  if (
                    currentChildProductId ===
                      records[j].vlocity_cmt__ChildProductId__c &&
                    parentProductId ===
                      records[j].vlocity_cmt__ParentProductId__c
                  ) {
                    expect( records[j] ).toHaveProperty(
                      "vlocity_cmt__ChildProductName__c",
                      currentChildProductName,
                    );
                    expect( records[j] ).toHaveProperty(
                      "vlocity_cmt__ParentProductName__c",
                      parentProductName,
                    );
                    break;
                  } else if ( j === records.length - 1 ) {
                    throw new Error(
                      "There is no child product with name: '" +
                        currentChildProductName +
                        "', for product: '" +
                        parentProductName +
                        "', with id: " +
                        parentProductId,
                    );
                  }
                }
              },
            );
          }
        } catch ( error ) {
          console.error( "Verifying child products has failed:", error );
          throw error;
        }
      },
    );
  }
}
