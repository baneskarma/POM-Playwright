import { expect } from "@playwright/test";
import { allure } from "allure-playwright";

/**
 * <b>PAGES : CPQ : ORDERS</b> [Create]: Create New Order
 */
export class CreateOrder {
  constructor( page ) {
    ( async () => {
      this.page = page;
      this.newPage;
      // newOrder
      this.orders = page.locator( "lst-breadcrumbs" ).getByText( "Orders" );
      this.newButton = page.getByRole( "button", { name: "New" });
      this.searchAccount = page.getByPlaceholder( "Search Accounts..." );
      this.showAllResults;
      this.searchedResults = page.locator( "td > .outputLookupLink" );
      this.startDate = page.getByLabel( "*Order Start Date" );
      this.priceList = page.getByPlaceholder( "Search Price Lists..." );
      this.selectPriceList;
      this.saveButton = page.getByRole( "button", { name: "Save", exact: true });
      this.successMessage = page.locator(
        "//div[@role='alert' and @data-key='success']",
      );
      // configureOrder
      this.popup;
      this.configureOrderButton = page
        .locator( "button" )
        .filter({ hasText: "Configure Order" });
      // addProductToOrder
      this.addProdcutsButton = page.locator( "//div[@title='Add Products']" );
      this.searchProduct = page.getByPlaceholder( "Search Products..." );
      this.productOption;
      this.pageNextButton = page.getByRole( "button", { name: "Next" });
      this.quantityButton = page.locator(
        "//button//span[contains(text(), 'Edit Quantity')]",
      ); //page.getByRole('button', { name: 'Edit Quantity: Item 1' });
      this.quantity = page.getByLabel( "Quantity*" );
      this.unitPriceButton = page.locator(
        "//button//span[contains(text(), 'Edit Unit Price')]",
      ); //page.getByRole('button', { name: 'Edit Unit Price: Item 1' });
      this.unitPrice = page.getByLabel( "Unit Price*" );
      this.productLink;
      this.totalPrice;
      // createAsset
      //this.createAssetButton = page.locator('button').filter({ hasText: 'Create Assets' });
      this.createAssetButton = page.locator( "//span[text()='Create Assets']" );
      this.assetSpinner =
        "//div[@class='mask vlc-slds-mask']//div[@role='alert']//child::div[@class='slds-spinner__dot-b']";
      this.frame;
      this.assetOrderResults =
        "//div//child::h1[contains(text(),'Order Submission Results')]";
      this.assetOrderSuccess = "//div//child::p[contains(text(),'Submission')]";
      ( this.assetNextButton = "button" ), { name: "Next" };
    })();
  }

  /**
   * [Properties] - properties that will be intialized after the new tab is opened.
   */
  initializeProperties() {
    // configureOrder
    this.searchBar = this.newPage.getByPlaceholder( "Search" );
    this.product;
    this.addToCartButton;
    this.productInCart;
    this.alert = this.newPage.locator(
      "//*[@role='alert' and contains(@class,'cpq-cart-errors')]",
    );
    this.productQuantity = this.newPage.getByRole( "spinbutton" );
    this.chargeType;
    this.spinner = this.newPage.locator(
      "//div[@class='slds-grid slds-grid_vertical cpq-left-sidebar scroll']//div[@class='slds-spinner_container']//div[@class='slds-spinner__dot-b']",
    );
    // addDiscount
    this.discountTab = this.newPage.getByRole( "button", { name: "DISCOUNTS" });
    this.discount;
    this.discountCartTabShown = this.newPage.locator(
      "//li[@class='slds-tabs_default__item slds-text-heading_label slds-active' and @title='Discounts ']",
    );
    this.discountCartTabHidden = this.newPage.locator(
      "//li[@class='slds-tabs_default__item slds-text-heading_label' and @title='Discounts ']",
    );
    this.discountInCart;
    this.discountCartTab = this.newPage.locator(
      "//a[contains(text(),'Discounts')]",
    );
    this.editDiscountButton = this.newPage.locator(
      "//button//*[@class='slds-button__icon slds-button__icon-- nds-button__icon nds-button__icon_ ']",
    );
    this.discountDetails = this.newPage.locator(
      "//label[text()='Recurring Charges']//parent::div[@class='slds-form-element cpq-pricing-picklist']//following-sibling::div",
    );
    this.cancelButton = this.newPage.getByRole( "button", { name: "Cancel" });
    this.discountSpinner = this.newPage.locator(
      "//div[@class='slds-grid slds-grid_vertical cpq-product-cart']//div[@class='slds-spinner_container']//div[@class='slds-spinner_brand slds-spinner slds-spinner_medium']//div[@class='slds-spinner__dot-b']",
    );

    // submitOrder
    this.submitOrderButton = this.newPage.getByRole( "button", {name: "Submit Order",});
    this.submitOrderResults = this.newPage.locator(
      "//div//child::h1[contains(text(),'Order Submission Results')]",
    );
    this.submitOrderSuccess = this.newPage.locator(
      "//div//child::p[contains(text(),'Submission')]",
    );
    this.newPageNextButton = this.newPage.locator( "//p[text()='Next']" );
    // productInAccount
    this.orderAccount = this.newPage.locator(
      "//h1//div//slot//child::*[text()='Account']",
    );
    this.fourthFrame;
    this.assetManagement =
      "//following::span[text()='Asset Management']//parent::button";
    this.assetManagementExpanded =
      "//following::span[text()='Asset Management']//parent::button[@aria-expanded='true']";
    this.assetManagementNotExpanded =
      "//following::span[text()='Asset Management']//parent::button[@aria-expanded='false']";
    this.productInAccount;
  }

  /**
   * <b>[Method]</b> - Create new order<br>
   * <br>
   * <i>Method functionality:</i><br>
   * This functionality creates new order, selects the account we want, enters the start date, and selects the price list we want. <br>
   * <br>
   * @param {string} accountValue - The name of the account.
   * @param {string} startDateValue - The start date value for the order. Date Format: dd.mm.yyyy
   * @param {string} priceListValue - The price list name.
   */ //h1//div//slot//child::*[text()='Account']
  async newOrder( accountValue, startDateValue, priceListValue ) {
    await allure.step( "Create new order", async () => {
      await allure.step( "Click New", async () => {
        await expect( this.orders ).toBeVisible();
        await this.newButton.click();
      });

      await allure.step( "Account name: " + accountValue, async () => {
        await this.searchAccount.click();
        await this.searchAccount.fill( accountValue );
        this.showAllResults = this.page.getByText(
          'Show more results for "' + accountValue + '"',
        );
        await this.showAllResults.click();
        await this.searchedResults.first().click();
      });

      await allure.step( "Start date: " + startDateValue, async () => {
        await this.startDate.click();
        await this.startDate.fill( startDateValue );
      });

      await allure.step( "Price list: " + priceListValue, async () => {
        await this.priceList.click();
        await this.priceList.fill( priceListValue );
        this.selectPriceList = this.page.getByTitle( priceListValue, {exact: true,});
        await this.selectPriceList.click();
      });

      await allure.step( "Order created successfully", async () => {
        await this.saveButton.click();
        await expect( this.successMessage ).toBeVisible();
        await expect( this.successMessage ).toBeHidden();
      });
    });
  }

  /**
   * <b>[Method]</b> - Configure order after creating new order<br>
   * <br>
   * <i>Method functionality:</i><br>
   * This functionality configures the order, adds the wanted product in the cart, with the quantity we need, and checks the total charges of the charge type we want. <br>
   * <br>
   * @param {string} productName - The name of the product.
   * @param {string} quantityValue - The product quantity value.
   * @param {string} chargesType - The charges type(eg. 'Reccuring Total').
   * @param {string} totalCharges - The total charges value.
   * @param {boolean} [addDiscount=false] - Default value is false, so it won't add a discount.
   * @param {string} [discountName=""] - The discount name.
   * @param {string} [discountValue=""] - The discount value in percents.
   * @param {string} [discountDuration=""] - The discount duration in months.
   */
  async configureOrder( productName, quantityValue, chargesType, totalCharges ) {
    await allure.step( "Configure order", async () => {
      await allure.step( "Click Configure Order", async () => {
        await Promise.all( [
          this.page.waitForEvent( "popup" ),
          this.configureOrderButton.click( "button" ),
          this.page.waitForLoadState( "domcontentloaded" ),
        ] );
      });

      await allure.step( "Switch to second browser tab", async () => {
        // Switch to 2nd tab
        let pages = await this.page.context().pages();
        await expect( pages.length ).toBeGreaterThan( 1 );
        this.newPage = await pages[1];
        await this.newPage.waitForLoadState( "domcontentloaded" );
        await this.newPage.waitForSelector( '[placeholder="Search"]' );
        await this.newPage.bringToFront();

        // Initialize properties for 2nd tab
        this.initializeProperties();
      });

      await allure.step( "Search product: " + productName, async () => {
        // actions on 2nd tab
        await allure.step( "Searchbar actions", async () => {
          await this.searchBar.click();
          await this.searchBar.fill( productName );
          await expect( this.searchBar ).toHaveValue( productName );
        });

        await allure.step( "Wait for products to load", async () => {
          await expect( this.spinner ).toBeVisible();
          await expect( this.spinner ).toBeHidden();
        });

        await allure.step( "Check if product is on the page", async () => {
          // Check if product is shown or refresh the page.
          this.product = await this.newPage.locator(
            "//span[text()='" + productName + "']",
          );
          let productCount = await this.product.count();

          while ( productCount < 1 ) {
            await allure.step( "Reload page", async () => {
              await this.newPage.reload({ waitUntil: "networkidle" });
              await this.newPage.waitForLoadState( "domcontentloaded" );
            });

            await allure.step( "Wait for products to load", async () => {
              await expect( this.spinner ).toBeVisible();
              await expect( this.spinner ).toBeHidden();
            });

            await allure.step(
              "Search product and check if it's on the page",
              async () => {
                await this.searchBar.fill( productName );
                await expect( this.searchBar ).toHaveValue( productName );
                productCount = await this.product.count();
              },
            );
          }
        });

        await allure.step( "Verify product is visible", async () => {
          this.product = this.product.first();
          await this.product.scrollIntoViewIfNeeded();
          await expect( this.product ).toBeVisible();
        });
      });

      await allure.step( "Add product to cart", async () => {
        await allure.step( "Click add to cart button", async () => {
          this.addToCartButton = this.newPage.locator(
            "//span[text()='" +
              productName +
              "']//parent::div//parent::div//following-sibling::div//button",
          );
          await this.addToCartButton.first().click();
        });

        await allure.step( "Verify product is added to cart", async () => {
          // verify product is added to cart
          this.productInCart = this.newPage.locator(
            "//div[text()='" + productName + "']",
          );
          await expect( this.productInCart ).toBeVisible();
          if ( await this.alert.isVisible() ) {
            throw new Error(
              "An alert should not be present when adding the product to the cart!",
            );
          }
        });
      });

      await allure.step(
        "Set product quantity to " + quantityValue,
        async () => {
          // set quantity, unit price and check total charges
          await this.productQuantity.fill( quantityValue );
          // ---------------------------- missing unit price
        },
      );

      await allure.step(
        "Check total charges is " +
          totalCharges +
          ", for charge type: " +
          chargesType,
        async () => {
          this.chargeType = this.newPage.locator(
            "//div[contains(text(),'" +
              chargesType +
              "')]//following-sibling::div",
          );
          await expect( this.chargeType ).toContainText( totalCharges );
        },
      );
    });
  }

  /**
   * <b>[Method]</b> - Add a discount for product. <br>
   * <br>
   * <i>Method functionality:</i><br>
   * This functionality adds a discount for the product, and it will verify the discount's duration and percentage. It also verifies the total discounted charges of the product. <br>
   * <br>
   * @param {string} discountName - The discount name.
   * @param {string} discountValue - The discount value in percents.
   * @param {string} discountDuration - The discount duration in months.
   */
  async addDiscount( discountName, discountValue, discountDuration ) {
    await allure.step( "Add discount " + discountName, async () => {
      let newDiscountName = discountName.toLowerCase();
      if (
        newDiscountName.includes( "discount" ) &&
        newDiscountName.includes( "months" )
      ) {
        newDiscountName = newDiscountName
          .replace( /discount/gi, "DISCOUNT" )
          .replace( /months/gi, "MONTHS" );
      }

      // search and check if discount is available, then add it to cart
      await allure.step( "Search discount " + newDiscountName, async () => {
        await allure.step( "Click discount tab", async () => {
          await this.discountTab.click();
        });

        await allure.step( "Searchbar actions", async () => {
          await this.searchBar.click();
          await this.searchBar.fill( newDiscountName );
          await expect( this.searchBar ).toHaveValue( newDiscountName );
        });

        await allure.step( "Wait for discounts to load", async () => {
          await expect( this.spinner ).toBeVisible();
          await expect( this.spinner ).toBeHidden();
        });

        await allure.step( "Wait for discount to be visible", async () => {
          this.discount = this.newPage.locator(
            "//span[contains(text(),'" + newDiscountName + "')]",
          );
          await expect( this.discount.first() ).toBeVisible();
        });
      });

      await allure.step( "Add discount to cart", async () => {
        await allure.step( "Click Add to cart", async () => {
          this.addToCartButton = this.newPage.locator(
            "//span[contains(text(),'" +
              newDiscountName +
              "')]//parent::div//parent::div//following-sibling::div//button",
          );
          await this.addToCartButton.first().click();
        });

        await allure.step( "Verify DISCOUNTS tab is opened", async () => {
          await allure.step(
            "Click DISCOUNTS tab if it's not shown",
            async () => {
              if ( ( await this.discountCartTabHidden.isVisible() ) === true ) {
                await this.discountCartTabHidden.click();
              }
              await expect( await this.discountCartTabShown ).toBeVisible();
            },
          );

          await allure.step(
            "Wait for DISCOUNTS tab in cart to load",
            async () => {
              let spinner = this.discountSpinner.last();
              await expect( await spinner ).toBeVisible();
              await expect( await spinner ).toBeHidden();
            },
          );
        });

        // Check if discount is added to cart, and verify it's duration and percentage.
        await allure.step( "Verify discount is added to cart", async () => {
          let discountInCartCount;

          await allure.step( "Check if discount is added to cart", async () => {
            this.discountInCart = await this.newPage.getByText( discountName, {exact: true,});
            discountInCartCount = await this.discountInCart.count();
          });

          await allure.step(
            "Reload page if discount is still not visible in cart",
            async () => {
              while ( discountInCartCount < 1 ) {
                await allure.step(
                  "Reload page and click DISCOUNTS tab",
                  async () => {
                    await this.newPage.reload({ waitUntil: "networkidle" });
                    await this.discountCartTab.click();
                  },
                );

                await allure.step(
                  "Wait for DISCOUNTS tab in cart to load",
                  async () => {
                    let spinner = this.discountSpinner.last();

                    try {
                      await expect( await spinner ).toBeVisible();
                      await expect( await spinner ).toBeHidden();
                    } catch ( error ) {
                      allure.logStep( "DISCOUNTS tab is already loaded" );
                    }
                    discountInCartCount = await this.discountInCart.count();
                  },
                );
              }
            },
          );

          await allure.step(
            "Verify discount visibility in the cart",
            async () => {
              await expect( this.discountInCart ).toBeVisible();
            },
          );
        });
      });

      await allure.step(
        "Verify discount value is -" + discountValue,
        async () => {
          await this.editDiscountButton.first().click();
          let actualDiscountValue =
            ( await this.discountDetails
              .first()
              .locator( "//input" )
              .inputValue() ) + ( await this.discountDetails.nth( 1 ).innerText() );
          discountValue = "-" + discountValue;
          expect( actualDiscountValue ).toBe( discountValue );
        },
      );

      await allure.step(
        "Verify discount duration is " + discountDuration,
        async () => {
          let actualDiscountDuration = await this.discountDetails
            .last()
            .innerText();
          expect( actualDiscountDuration ).toBe( discountDuration );
          await this.cancelButton.click();
        },
      );
    });
  }

  /**
   * <b>[Method]</b> - Submit configured order <br>
   * <br>
   * <i>Method functionality:</i><br>
   * This function submits the order we configured, and checks if it was successful. <br>
   */
  async submitOrder() {
    // Submit order
    await allure.step( "Submit order", async () => {
      await allure.step( "Click Submit Order", async () => {
        await expect( this.submitOrderButton ).toBeVisible();
        await this.submitOrderButton.click();
      });

      await allure.step( "Wait for successful results", async () => {
        await expect( this.submitOrderResults ).toBeVisible();
        await expect( this.submitOrderSuccess ).toHaveText( /.*was successful./ );
      });

      await allure.step( "Click Next", async () => {
        await this.newPageNextButton.click();
      });
    });
  }

  /**
   * <b>[Method]</b> - Check if the product is in the account <br>
   * <br>
   * <i>Method functionality:</i><br>
   * This function checks if the product was successfully added to the account, after submiting the order. <br>
   * <br>
   * @param {string} productName - The name of the product.
   */
  async checkProductInAccount( productName ) {
    await allure.step(
      "Verify product '" +
        productName +
        "', was successfully added to the account",
      async () => {
        await allure.step( "Wait for account to be visible", async () => {
          await expect( this.orderAccount ).toBeVisible();
        });

        await allure.step( "Verify asset menagment is visible", async () => {
          let assetManagement = this.newPage.locator( this.assetManagement );
          await assetManagement.scrollIntoViewIfNeeded();
          await expect( assetManagement ).toBeVisible();
        });

        await allure.step( "Verify asset menagment is expanded", async () => {
          let assetManagementNotExpanded = this.newPage.locator(
            this.assetManagementNotExpanded,
          );
          let assetManagementExpanded = this.newPage.locator(
            this.assetManagementExpanded,
          );
          if ( ( await assetManagementNotExpanded.isVisible() ) === true ) {
            await assetManagementNotExpanded.click();
          }
          await expect( await assetManagementExpanded ).toBeVisible();
        });

        await allure.step( "Verify product is visible as asset", async () => {
          this.fourthFrame = await this.newPage.frames().slice( -1 )[0];
          this.productInAccount = this.fourthFrame.locator(
            "//div[@class='p-name']//a[text()='" + productName + "']",
          );
          this.firstProductInAccount = await this.productInAccount.first();
          //await expect(this.productInAccount).toBeVisible();
          let productInAccount = this.firstProductInAccount.textContent();
          expect( await productInAccount ).toBe( productName );
        });
      },
    );
  }

  /**
   * <b>[Method]</b> - Add product to the order <br>
   * <br>
   * <i>Method functionality:</i><br>
   * This functionality adds the wanted product to the order, with the quantity and unit price we have given, in the end checks the total price of the order. <br>
   * <br>
   * @param {string} productName - The name of the product.
   * @param {string} quantity - The value for the quantity of the product.
   * @param {string} unitPrice - The price of one unit for the product.
   * @param {string} totalPrice - The total price of the order.
   */
  async addProductToOrder( productName, quantity, unitPrice, totalPrice ) {
    await allure.step(
      "Add product '" + productName + "' to the order",
      async () => {
        await allure.step( "Click Add Products", async () => {
          await this.addProdcutsButton.click();
        });

        await allure.step( "Search product: " + productName, async () => {
          await this.searchProduct.click();
          await this.searchProduct.fill( productName );
          //await expect(this.searchProduct).toHaveValue(productName);
          this.productOption = this.page
            .locator( '[role="option"]' )
            .filter({ hasText: productName });

          let searchedProduct = this.productOption.nth( 1 );
          if ( ( await searchedProduct.isVisible() ) === true ) {
            await searchedProduct.click();
          } else {
            await this.searchProduct.click();
            await searchedProduct.click();
          }
          await this.pageNextButton.click();
        });

        await allure.step( "Set product quantity to " + quantity, async () => {
          await this.quantityButton.click();
          await this.quantity.fill( quantity );
        });

        await allure.step(
          "Set product unit price to " + unitPrice,
          async () => {
            await this.unitPriceButton.click();
            await this.unitPrice.fill( unitPrice );
          },
        );

        await allure.step( "Save added product", async () => {
          await this.saveButton.click();
        });

        await allure.step( "Verify total price is " + totalPrice, async () => {
          this.productLink = this.page
            .getByRole( "rowheader", { name: productName })
            .getByRole( "link" );
          await this.productLink.hover();
          this.totalPrice = this.page
            .getByLabel( productName + " Preview" )
            .filter({ hasText: totalPrice });
          await expect( this.totalPrice ).toBeVisible();
        });
      },
    );
  }

  /**
   * <b>[Method]</b> - Create asset of the added product<br>
   * <br>
   * <i>Method functionality:</i><br>
   * This functionality creates an asset of the added product. <br>
   */
  async createAsset() {
    await allure.step( "Create an asset", async () => {
      await allure.step( "Click create assets button", async () => {
        await this.createAssetButton.last().click();
        this.frame = await this.page.frames().slice( -1 )[0];
      });

      // await allure.step("Wait for page to load", async () => {
      //     await expect( await this.frame.locator( this.assetSpinner ) ).toBeVisible();
      //     await expect( await this.frame.locator( this.assetSpinner ) ).toBeHidden();
      // });

      await allure.step( "Wait for successful results", async () => {
        await expect( this.frame.locator( this.assetOrderResults ) ).toBeVisible();
        await expect( this.frame.locator( this.assetOrderSuccess ) ).toHaveText(
          /.*was successful./,
        );
      });

      await allure.step( "Click Next", async () => {
        await this.frame.getByRole( this.assetNextButton ).click();
      });

      //await this.page.getByRole('button', { name: 'Asset Management' }).click();
    });
  }
}
