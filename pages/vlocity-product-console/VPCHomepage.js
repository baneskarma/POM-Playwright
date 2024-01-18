import { expect, test } from "@playwright/test";
import { allure } from "allure-playwright";

/**
 * <b>PAGES : Vlocity Product Console</b> [Home]: Home Page
 */
export class VlocityProductConsole {
    constructor(page) {
        (async() => {
            this.page = page;
            // searchItem
            this.firstFrame;
            this.searchIconLocator;
            this.searchBar = "//input[@id='searchTerm']";
            this.secondFrame;
            // openProduct
            this.products;
            this.productCodes;
            this.thirdFrame;
            // verifyProductDropdownFields
            this.dropdownLocator;
            // verifyPricing
            this.tariffType;
            // gotoSection
            this.sectionElement;
            // verifyChildProductDetails
            this.childProductRows;
            this.childProductNameColumnsLocator;
        })();
    };

    /**
	 * <b>[Method]</b> - Search for Item <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * 1. This functionality clicks on the magnifying icon next to the item that we choose with the itemType string, and it switches to the frame of the searched item subtab<br>
	 * 2. It writes the name of the item into the searchbar. We choose what item will be searched in the itemName String, and then it clicks Enter<br>
	 * @param {string} itemType - The type of the item we want to search for (eg. Product)
	 * @param {string} itemName - The name of the item we want to search for (eg. Name of the product)
	 */
    async searchItem( itemType, itemName ) {
        await allure.step("Search vlocity item", async () => {
            this.firstFrame = await this.page.frames().slice( -1 )[0];

            await allure.step("Search '" + itemType + "' item", async () => {
                this.searchIconLocator = "//span[text()='Search " + itemType + "']//ancestor::span[@ng-click='searchObject(obj)']";      
                await this.firstFrame.locator(this.searchIconLocator).click();
            });

            this.secondFrame = await this.page.frames().slice( -1 )[0];

            await allure.step("Search " + itemType + " named: " + itemName, async () => {
                await this.secondFrame.locator(this.searchBar).fill( itemName );
                await expect(this.secondFrame.locator(this.searchBar)).toHaveValue( itemName );
                await this.secondFrame.locator(this.searchBar).press('Enter');
            });
        });
    };

    /**
	 * <b>[Method]</b> - Verify that product exists and open it<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality verifies the product name and code, so we can verify that the product exists. If it exists it opens the product<br>
	 * @param {string} productName - The name of the product
	 * @param {string} productCode - The code of the product
	 */
    async openProduct(productName, productCode) {
        await allure.step("Open vlocity product '" + productName + "', with product code " + productCode, async () => {
            let products = await this.secondFrame.getByText( productName );
            let productCodes = await this.secondFrame.getByText( productCode );
            let productsCount = await products.count();
            let productsCodeCount = await productCodes.count();
            let found = false;

            if (await productsCount > 0 && await productsCodeCount > 0) {
                for (let i = 0; i < productsCount; i++) {
                    let product = await products.nth(i);
                    let code = await productCodes.nth(i);
        
                    // Check products name and code
                    if (await product.innerText() == productName) {
                        if (await code.innerText() == productCode) {
                            found = true;
                            await product.click();
                            this.thirdFrame = await this.page.frames().slice(-1)[0];
                            break;
                        };
                    };
                };
            };
            
            // Fail the test if product was not found.      
            if(found === false) {
                throw new Error("There is no product with name: " + productName + " and code: " + productCode);
            };
        });
    };

    /**
	 * <b>[Method]</b> - Verify Product Values in the 'General Properties' section <br>
	 * <br>
	 * <i>Method functionality:</i> <br>
	 * This functionality verifies the values for the product fields that are present in the General Properties section<br>
	 * the variable fieldName is the key from the object productDetails, and it should contain the name of the field, for example "Specification Type". The variable actualFieldValue should contain the expected value for that field , for example "Product", which will be the value of the key fieldName.<br>
	 * @param {Object} productDetails - Object that contains the field names as keys of the object, and the field values as the values of the object
	 */
	async verifyProductDetails( productDetails ) {
        await allure.step("Verify product details", async () => {
            for(let fieldName in productDetails) {

                await allure.step("Field: " + fieldName + ", Value: " + productDetails[ fieldName ], async () => {
                    this.dropdownLocator = await this.thirdFrame.getByLabel( fieldName );
                    await expect(this.dropdownLocator).toHaveValue( productDetails[ fieldName ] );
                    //test.info().annotations.push({ type: String, description: "Field name: " + fieldName + " ; Field value: " + productDetails[ fieldName ] });
                });
            };
        });
	};

    /**
	 * <b>[Method]</b> - Verify child products exist in the Product Structure section<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This function verifies that the child products of a parent product exist, in the Product Structure section <br>
	 * @param childProductNames
	 */
	async verifyChildProducts( childProductNames ) {
        await allure.step("Verify child products", async () => {
            this.childProductRows = await this.thirdFrame.locator("//table[@class='slds-table slds-table--bordered slds-tree slds-table--tree product-hierarchy']//tbody//tr");
            const firstRow = await this.childProductRows.first();
            await expect(firstRow).toBeVisible();
            let rowsCount = await this.childProductRows.count();
            expect(await rowsCount).toBeGreaterThan(0);
            for(const name of childProductNames) {
                await allure.step("Product name: " + name, async () => {
                    let found = false;
                    for(let i = 0; i < rowsCount; i++) {
                        let childProductRow = await this.childProductRows.nth(i);
                        const childProductNameColumn = await childProductRow.locator("//th");
                        let actualName = await childProductNameColumn.innerText();
                        actualName = actualName.trim();
                        console.log(actualName, typeof(actualName));
                        if(actualName === name) {
                            found = true;
                            break;
                        };
                    };
                    if(found === false) {
                        throw new Error("The product doesn't have the specified child: " + name);
                    };
                });
            };
        });
    };

    /**
	 * <b>[Method]</b> - Verify Product Pricing details <br>
	 * <br>
	 * <i>Method functionality:</i> <br>
	 * This functionality for now verifies only the values for the field tariff type in the Pricing section <br>
	 * @param {string} pricingVariable - the tariff type (eg. 'Charging') 
	 */
    async verifyPricing( pricingVariable ) {
        await allure.step("Verify tariff type is " + pricingVariable, async () => {
            this.tariffType = await this.thirdFrame.locator('//table//tr[1]//td[4]//a');
            await this.tariffType;
            let tariffTypeText = await this.tariffType.innerText();
            expect(tariffTypeText).toContain( pricingVariable );
        });
    };

	/**
	 * <b>[Method]</b> - go to a section of the opened vlocity item<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality clicks a section of the opened item. We choose the section by adding the section name as parameter<br>
	 * @param {string} sectionName - the name of the section.
	 */
    async gotoSection( sectionName ) {
        await allure.step("Go to section: " + sectionName, async () => {
            this.sectionElement = await this.thirdFrame.getByRole('link', { name: sectionName });
            await this.sectionElement.click()
        });
    };
};
