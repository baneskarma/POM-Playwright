import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * <b>PAGES : CPQ : Orders</b> [Verify]: Verify data from Order
 */
export class VerifyOrder {
	constructor( page ) {
		( async () => {
			this.page = page;
			this.quantity = this.page.locator( "//div[@title='Quantity']//parent::div//following-sibling::div//span" );
			this.unitPrice = this.page.locator( "//div[@title='Unit Price']//parent::div//following-sibling::div//span" );
			this.totalPrice = this.page.locator( "//div[@title='Total Price']//parent::div//following-sibling::div//span" );
			this.relatedTab = this.page.locator( "//li[@title='Related']//a" );
			this.detailsTab = this.page.locator( "//li[@title='Details']//a" );
			this.accountName = this.page.locator( "//*[@field-label='Account Name']//slot[text()]" );
			this.startDate = this.page.locator( "//*[@field-label='Order Start Date']//slot//lightning-formatted-text" );
			this.priceList = this.page.locator( "//*[@field-label='Price List']//slot[text()]" );
			this.amount = this.page.locator( "//*[@field-label='Order Amount']//slot//lightning-formatted-text" );
			this.orderStatus = this.page.locator( "//*[@field-label='Status']//slot//lightning-formatted-text" );
			this.orderActivated = this.page.locator( "//a[@data-tab-name='Activated' and @aria-selected='true']" );
		})();
	}

	/**
	 * **[Method]** - Verify order's product data
	 *
	 * *Method functionality:*
	 * This functionality verifies the data for the added product of the opened Order. <br>
	 *
	 * @param {string} name - The name of the order.
	 * @param {string} quantity - The number of units for the order.
	 * @param {string} price - The number of price per unit.
	 */
	async verifyOrderedProductData( name, quantity, price ) {
		await allure.step( "Verify order's product data", async () => {
			await this.relatedTab.last().click();
			const totalPrice = ( parseInt( quantity ) * parseInt( price ) ).toString();

			await allure.step( 'Verify product name is ' + name, async () => {
				this.orderName = this.page.locator( "//table[@aria-label='Order Products']//tbody//a[text()='" + name + "']" ).last();
				await expect( this.orderName ).toBeVisible();
				await this.orderName.hover();
			});

			await allure.step( 'Verify product quantity is ' + quantity, async () => {
				await expect( this.quantity ).toHaveText( quantity + ',00' );
			});

			await allure.step( 'Verify product unit price is ' + price, async () => {
				await expect( this.unitPrice ).toHaveText( price + ',00 kr' );
			});

			await allure.step( 'Verify product total price is ' + totalPrice, async () => {
				await expect( this.totalPrice ).toHaveText( totalPrice + ',00 kr' );
			});
		});
	}

	/**
	 * **[Method]** - Search for order
	 *
	 * *Method functionality:*
	 * This functionality searches the order by its ID, and opens it. <br>
	 *
	 * @param {string} orderId - The name of the order.
	 */
	async searchOrder( orderId ) {
		await allure.step( 'Open order with id ' + orderId, async () => {
			this.order = this.page.locator( "//table[@aria-label='Recently Viewed']//tr//th//a[@data-recordid='" + orderId + "']" );
			await this.order.click();
		});
	}

	/**
	 * **[Method]** - Verify order details
	 *
	 * *Method functionality:*
	 * This functionality verifies the order data in the details tab. <br>
	 *
	 * @param {string} accountName - The name of the order's account.
	 * @param {string} priceList - The order's price list.
	 * @param {string} startDate - The order's start date.
	 * @param {string} status - The order's status.
	 */
	async verifyOrderDetails( accountName, priceList, startDate, status ) {
		await allure.step( 'Open details tab', async () => {
			this.detailsTab.last().click();

			const [ year, month, day ] = startDate.split( '-' );
			const dayNumber = parseInt( day, 10 );
			const monthNumber = parseInt( month, 10 );
			const transformedDate = `${dayNumber}.${monthNumber}.${year}`;

			await allure.step( "Verify order's account name is " + accountName, async () => {
				await expect( this.accountName ).toHaveText( accountName );
			});

			await allure.step( "Verify order's price list is " + priceList, async () => {
				await expect( this.priceList ).toHaveText( priceList );
			});

			await allure.step( "Verify order's date is " + transformedDate, async () => {
				await expect( this.startDate ).toHaveText( transformedDate );
			});

			await allure.step( "Verify order's status is " + status, async () => {
				await expect( this.orderStatus.last() ).toHaveText( status );
			});
		});
	}

	/**
	 * **[Method]** - Verify order has been activated
	 *
	 * *Method functionality:*
	 * This functionality verifies that the order has been activated
	 */
	async verifyOrderActivation() {
		await allure.step( 'Verify order is active', async () => {
			await expect( this.orderActivated ).toBeVisible();
		});
	}
}
