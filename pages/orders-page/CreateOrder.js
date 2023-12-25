import { expect } from '@playwright/test';

/**
 * <b>PAGES : CPQ : ORDERS</b> [Create]: Create New Order
 */
export class CreateOrder {
    constructor(page) {
        (async() => {
            this.page = page;
            this.newPage;
            // newOrder
            this.orders = page.locator('lst-breadcrumbs').getByText('Orders');
            this.newButton = page.getByRole('button', { name: 'New' });
            this.searchAccount = page.getByPlaceholder('Search Accounts...');
            this.showAllResults;
            this.searchedResults = page.locator('td > .outputLookupLink');
            this.startDate = page.getByLabel('*Order Start Date');
            this.priceList = page.getByPlaceholder('Search Price Lists...');
            this.selectPriceList;
            this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
            this.successMessage = page.getByRole('alertdialog', { name: 'Success' });
            // configureOrder
            this.popup;
            this.configureOrderButton = page.locator('button').filter({ hasText: 'Configure Order' });
            // addProductToOrder
            this.addProdcutsButton = page.getByRole('button', { name: 'Add Products' });
            this.searchProduct = page.getByPlaceholder('Search Products...');
            this.productOption;
            this.pageNextButton = page.getByRole('button', { name: 'Next' });
            this.quantityButton = page.locator("//button//span[contains(text(), 'Edit Quantity')]") //page.getByRole('button', { name: 'Edit Quantity: Item 1' });
            this.quantity = page.getByLabel('Quantity*');
            this.unitPriceButton = page.locator("//button//span[contains(text(), 'Edit Unit Price')]") //page.getByRole('button', { name: 'Edit Unit Price: Item 1' });
            this.unitPrice = page.getByLabel('Unit Price*');
            this.productLink;
            this.totalPrice;
            // createAsset
            this.createAssetButton = page.locator('button').filter({ hasText: 'Create Assets' });
            this.frame;
            this.assetOrderResults = "//div//child::h1[contains(text(),'Order Submission Results')]";
            this.assetOrderSuccess = "//div//child::p[contains(text(),'Submission')]";
            this.assetNextButton = 'button', { name: 'Next' };    
        })();   
    };

    /**
     * [Properties] - properties that will be intialized after the new tab is opened.
     */
    initializeProperties() {
        // configureOrder
        this.searchBar = this.newPage.getByPlaceholder('Search');
        this.product;
        this.addToCartButton;
        this.productInCart;
        this.alert = this.newPage.locator("//*[@role='alert' and contains(@class,'cpq-cart-errors')]");
        this.productQuantity = this.newPage.getByRole('spinbutton');
        this.chargeType;
        // addDiscount
        this.discountTab = this.newPage.getByRole('button', { name: 'DISCOUNTS' });
        this.discount;
        this.discountInCart;
        this.editDiscountButton = this.newPage.locator("//button//*[@class='slds-button__icon slds-button__icon-- nds-button__icon nds-button__icon_ ']");
        this.discountDetails = this.newPage.locator("//label[text()='Recurring Charges']//parent::div[@class='slds-form-element cpq-pricing-picklist']//following-sibling::div");
        this.cancelButton = this.newPage.getByRole('button', { name: 'Cancel' });
        // submitOrder
        this.submitOrderButton = this.newPage.getByRole('button', { name: 'Submit Order' });
        this.submitOrderResults = this.newPage.locator("//div//child::h1[contains(text(),'Order Submission Results')]");
        this.submitOrderSuccess = this.newPage.locator("//div//child::p[contains(text(),'Submission')]");
        this.newPageNextButton = this.newPage.locator("//p[text()='Next']");
        // productInAccount
        this.orderAccount = this.newPage.locator("//h1//div[text()='Account']");
        this.fourthFrame;
        this.assetManagement;
        this.productInAccount;
    };

    /**
     * <b>[Method]</b> - Create new order<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality creates new order, selects the account we want, enters the start date, and selects the price list we want. <br>
     * <br>
	 * @param {string} accountValue - The name of the account.
	 * @param {string} startDateValue - The start date value for the order. Date Format: dd.mm.yyyy 
	 * @param {string} priceListValue - The price list name.
	 */
    async newOrder( accountValue, startDateValue, priceListValue ) {
        await expect(this.orders).toBeVisible();
        await this.newButton.click();
        await this.searchAccount.click();
        await this.searchAccount.fill( accountValue );
        this.showAllResults = this.page.getByText('Show All Results for "' + accountValue + '"');
        await this.showAllResults.click();
        await this.searchedResults.first().click();
        await this.startDate.click();
        await this.startDate.fill( startDateValue );
        await this.priceList.click();
        await this.priceList.fill( priceListValue );
        this.selectPriceList = this.page.getByTitle( priceListValue, { exact: true });
        await this.selectPriceList.click();
        await this.saveButton.click();
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toBeHidden();
    };

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
        await Promise.all([
            this.page.waitForEvent('popup'),
            this.configureOrderButton.click('button'),
            this.page.waitForLoadState('domcontentloaded')
          ]);

        // change to 2nd tab
        let pages = await this.page.context().pages();
        await expect(pages.length).toBeGreaterThan(1);
        this.newPage = await pages[1];
        await this.newPage.waitForLoadState('domcontentloaded');
        await this.newPage.waitForSelector('[placeholder="Search"]');
        await this.newPage.bringToFront();

        // Initialize properties for 2nd tab
        this.initializeProperties();

        // actions on 2nd tab
        await this.searchBar.click();
        await this.searchBar.fill( productName );
        await expect(this.searchBar).toHaveValue( productName );

        // Check if product is shown or refresh the page.
        this.product = this.newPage.locator("//span[text()='" + productName + "']");
        var productCount = await this.product.count();
        
        while(productCount < 1) {
            await this.newPage.reload({ waitUntil: 'networkidle' });
            await this.searchBar.fill( productName );
            productCount = this.product.count();
        };

        this.product = this.product.first();
        await this.product.scrollIntoViewIfNeeded();
        await expect(this.product).toBeVisible();
        this.addToCartButton = this.newPage.locator("//span[text()='" + productName + "']//parent::div//parent::div//following-sibling::div//button");
        await this.addToCartButton.first().click();

        // verify product is added to cart
        this.productInCart = this.newPage.locator("//div[text()='" + productName + "']");
        await expect(this.productInCart).toBeVisible();
        if (await this.alert.isVisible()) {
            throw new Error("An alert should not be present when adding the product to the cart!");
        };

        // set quantity, unit price and check total charges
        await this.productQuantity.fill( quantityValue );
        // ---------------------------- missing unit price
        this.chargeType = this.newPage.locator("//div[contains(text(),'" + chargesType + "')]//following-sibling::div");
        await expect(this.chargeType).toContainText( totalCharges );
    };

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
        let newDiscountName = discountName.toLowerCase();
        if(newDiscountName.includes("discount") && newDiscountName.includes("months")) {
            newDiscountName = newDiscountName.replace(/discount/gi, "DISCOUNT").replace(/months/gi, "MONTHS");
        };

        // search and check if discount is available, then add it to cart
        await this.discountTab.click();
        await this.searchBar.click();
        await this.searchBar.fill( newDiscountName );
        await expect(this.searchBar).toHaveValue( newDiscountName );

        this.discount = this.newPage.locator("//span[contains(text(),'" + newDiscountName + "')]");
        await expect(this.discount.first()).toBeVisible();
        this.addToCartButton = this.newPage.locator("//span[contains(text(),'" + newDiscountName + "')]//parent::div//parent::div//following-sibling::div//button");
        await this.addToCartButton.first().click();

        // Check if discount is added to cart, and verify it's duration and percentage.
        this.discountInCart = this.newPage.getByText( discountName, { exact: true });
        let discountInCartCount = await this.discountInCart.count();

        if(discountInCartCount == 0){
            await this.addToCartButton.first().click();
        };
        
        while(discountInCartCount < 1) {
            await this.newPage.reload({ waitUntil: 'networkidle' });
            this.discountCartTab = this.newPage.locator("//a[contains(text(),'Discounts')]")
            await this.discountCartTab.click();
            //this.spinner = this.newPage.locator("//div[@class='slds-grid slds-grid_vertical cpq-product-cart']//div[@class='slds-spinner_container']");
            //await expect(this.spinner.toBeVisible());
            //await expect(this.spinner.toBeHidden());
            discountInCartCount = await this.discountInCart.count();
        };

        await expect(this.discountInCart).toBeVisible();
        await this.editDiscountButton.first().click();
        let actualDiscountValue = await this.discountDetails.first().locator("//input").inputValue() + await this.discountDetails.nth(1).innerText();
        discountValue = "-" + discountValue;
        expect(actualDiscountValue).toBe(discountValue);
        let actualDiscountDuration = await this.discountDetails.last().innerText();
        expect(actualDiscountDuration).toBe(discountDuration);
        await this.cancelButton.click();
    };

    /**
     * <b>[Method]</b> - Submit configured order <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality submits the order we configured, and checks if it was successful. <br>
	 */
    async submitOrder() {
        // Submit order
        await expect(this.submitOrderButton).toBeVisible();
        await this.submitOrderButton.click();
        await expect(this.submitOrderResults).toBeVisible();
        await expect(this.submitOrderSuccess).toHaveText(/.*was successful./);
        await this.newPageNextButton.click();
    };

    /**
     * <b>[Method]</b> - Check if the product is in the account <br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality checks if the product was successfully added to the account, after submiting the order. <br>
     * <br>
	 * @param {string} productName - The name of the product.
	 */
    async checkProductInAccount( productName ) {
        await expect(this.orderAccount).toBeVisible();
        this.fourthFrame = await this.newPage.frames().slice( -1 )[0];
        this.productInAccount = this.fourthFrame.locator("//div[@class='p-name']//a[text()='" + productName + "']");
        this.productInAccount = await this.productInAccount.first();
        //await expect(this.productInAccount).toBeVisible();
        let productInAccount = await this.productInAccount.textContent();
        await expect(productInAccount).toBe(productName);
    };

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
        await this.addProdcutsButton.click();
        await this.searchProduct.click();
        await this.searchProduct.fill( productName );
        this.productOption = this.page.locator('[role="option"]').filter({ hasText: productName });
        await this.productOption.nth(1).click();
        await this.pageNextButton.click();

        // await this.page.pause();
        await this.quantityButton.click();
        await this.quantity.fill( quantity );
        await this.unitPriceButton.click();
        await this.unitPrice.fill( unitPrice );
        await this.saveButton.click();
        this.productLink = this.page.getByRole('rowheader', { name: productName }).getByRole('link');
        await this.productLink.hover();
        this.totalPrice = this.page.getByLabel( productName + ' Preview').filter({ hasText: totalPrice });
        await expect(this.totalPrice).toBeVisible();
    };

    /**
     * <b>[Method]</b> - Create asset of the added product<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality creates an asset of the added product. <br>
	 */
    async createAsset() {
        await this.createAssetButton.nth(2).click();
        this.frame = await this.page.frames().slice( -1 )[0];
        await expect(this.frame.locator(this.assetOrderResults)).toBeVisible();
        await expect(this.frame.locator(this.assetOrderSuccess)).toHaveText(/.*was successful./);
        await this.frame.getByRole(this.assetNextButton).click();
        //await this.page.getByRole('button', { name: 'Asset Management' }).click();
    };
};
