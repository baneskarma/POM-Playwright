import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { Verifications } from '../verifications/Verifications';

/**
 * **PAGES : CPQ : ORDERS** [Create]: Create New Order
 */
export class CreateOrder {
	constructor(request) {
		this.request = request;
		this.verifications = new Verifications(this.request);
	}

	/**
	 * **[Method]** - Create new order
	 *
	 * *Method functionality* :
	 * - This method has functionality to create order with the specified account, start date, pricelist and status.
	 *   Next it will verify that the order is successfully created with the correct data.
	 *   It also stores the id and url from the created order in environment variables. **process.env.CURRENT_ORDER_URL** and **process.env.ORDER_ID**
	 *
	 * @param {string} accountId - The id of the account
	 * @param {string} startDate - The start date of the order. Format: "YYYY-MM-DD"
	 * @param {string} priceListName - The name of the price list
	 * @param {string} status - The order status. should be 'Draft'
	 */
	async newOrder(accountId, startDate, priceListName, status) {
		await allure.step('Create new Order', async () => {
			//let priceListId;
			let orderData;
			let orderUrl;

			const priceListId = await this.getPriceListId(priceListName);
			//console.log(priceListId);

			await allure.step('Store Order Data', async () => {
				orderData = {
					AccountId: accountId,
					EffectiveDate: startDate,
					Status: status,
					vlocity_cmt__PriceListId__c: priceListId,
				};

				// if(typeof discountName === 'string' && discountName.trim().length > 0) {
				//     const discountId = await this.getDiscountId(discountName);
				//     orderData.vlocity_cmt__Discount__c = "10";
				//     orderData.discountName = discountName;
				//     //console.log("Order Data: " + orderData);
				//     console.log(orderData.vlocity_cmt__Discount__c);
				// };
			});

			try {
				const response = await this.request.post(process.env.COMMON_ORDER_URL, {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					data: JSON.stringify(orderData),
				});

				await this.verifications.verifyResponse(response, 201);

				await allure.step('Retrieving response data', async () => {
					const responseData = await response.json();
					console.log('Response from creating order is Success:', responseData);

					await allure.step('Store Order ID', async () => {
						const orderId = await responseData.id;
						process.env.ORDER_ID = orderId;
						//console.log("Order ID: " + process.env.orderId);
					});

					await allure.step('Store Order Url', async () => {
						orderUrl = process.env.COMMON_ORDER_URL + process.env.orderId;
						process.env.CURRENT_ORDER_URL = orderUrl;
					});
				});

				orderData.priceListName = priceListName;
				await this.verifications.verifyObjectIdAndData('Order', process.env.ORDER_ID, process.env.CURRENT_ORDER_URL, orderData);
			} catch (error) {
				console.error('Order creation failed:', error);
				throw error;
			}
		});
	}

	/**
	 * **[Method]** - Get Price list ID
	 *
	 * *Method functionality* :
	 * - This method has functionality to return the price list id by the specified price list name.
	 *
	 * @param {string} priceListName - The name of the price list
	 */
	async getPriceListId(priceListName) {
		let priceListId;
		await allure.step('Get id for the price list: ' + priceListName, async () => {
			try {
				const response = await this.request.get(process.env.COMMON_URL + 'query?q=SELECT+Name,Id+FROM+vlocity_cmt__PriceList__c', { headers: { Authorization: `Bearer ${process.env.sfAccessToken}` } });

				const responseData = await response.json();
				const records = responseData.records;
				for (const record of records) {
					if (record.Name === priceListName) {
						priceListId = record.Id;
						// console.log(typeof priceListId);
						// console.log("The id of price list: " + priceListId);
						return priceListId;
					}
				}

				throw new Error('There is no price list with name: ' + priceListName);
			} catch (error) {
				console.error('Getting Order Price List ID failed:', error);
				throw error;
			}
		});
		return priceListId;
	}

	/**
	 * **[Method]** - Create Order Item (add product to order)
	 *
	 * *Method functionality* :
	 * - This method has functionality to create order item, meaning to add a specified product to the specified order with the specified quantity and unit price.
	 *  It also verifies that the order item is successfully created with the correct data.
	 *
	 * @param {string} orderId - The id of the order
	 * @param {string} productName - The name of the product
	 * @param {string} quantity - The quantity of the product
	 * @param {string} unitPrice - The unit price of the product
	 */
	async createOrderItem(orderId, productName, quantity, unitPrice) {
		// const verifications = new Verifications(this.request);

		await allure.step("Add Product '" + productName + "' to Order", async () => {
			let orderItemData;
			let orderItemUrl;

			const productAndPricebookEntryId = await this.getProductIdAndPricebookEntryId(productName);
			const productId = productAndPricebookEntryId.productId;
			const pricebookEntryId = productAndPricebookEntryId.pricebookEntryId;
			// console.log(productId);
			// console.log(pricebookEntryId);

			await allure.step('Store Order Item Data', async () => {
				orderItemData = {
					OrderId: orderId,
					Product2Id: productId,
					Quantity: quantity,
					UnitPrice: unitPrice,
					//"ListPrice": listPrice,
					PricebookEntryId: pricebookEntryId,
					//"vlocity_cmt__AssetId__c": process.env.ASSET_ID,
				};
			});

			try {
				const response = await this.request.post(process.env.COMMON_ORDER_ITEM_URL, {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					data: JSON.stringify(orderItemData),
				});

				await this.verifications.verifyResponse(response, 201);

				await allure.step('Retrieving response data', async () => {
					const responseData = await response.json();
					console.log('Response from adding item to order is Success:', responseData);

					await allure.step('Store Order Item ID', async () => {
						const orderItemId = await responseData.id;
						process.env.ORDER_ITEM_ID = orderItemId;
						//console.log("Order ID: " + process.env.ORDER_ID);
					});

					await allure.step('Store Order Item Url', async () => {
						orderItemUrl = process.env.COMMON_ORDER_ITEM_URL + process.env.ORDER_ITEM_ID;
						process.env.CURRENT_ORDER_ITEM_URL = orderItemUrl;
					});
				});

				await this.verifications.verifyObjectIdAndData('OrderItem', process.env.ORDER_ITEM_ID, process.env.CURRENT_ORDER_ITEM_URL, orderItemData);
			} catch (error) {
				console.error('Adding item to order has failed:', error);
				throw error;
			}
		});
	}

	/**
	 * **[Method]** - Get Product ID and Pricebook Entry ID
	 *
	 * *Method functionality* :
	 * - This method has functionality to return the Product ID and Pricebook Entry ID by the specified product name.
	 * It returns an object with key:value pairs containing both the product and pricebook entry id.
	 *
	 * @param {string} productName - The name of the product
	 */
	async getProductIdAndPricebookEntryId(productName) {
		// pricebook entry has the same name as the product
		let productId;
		let pricebookEntryId;
		await allure.step('Get id for the product and pricebook entry: ' + productName, async () => {
			try {
				const response = await this.request.get(process.env.COMMON_URL + 'query?q=SELECT+Name,Id,Product2Id+FROM+PriceBookEntry', {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
					},
				});

				const responseData = await response.json();
				const records = responseData.records;
				for (const record of records) {
					if (record.Name === productName) {
						productId = record.Product2Id;
						pricebookEntryId = record.Id;
						//console.log("The id of product: " + productId + " id of entry: " + pricebookEntryId);
						return { productId, pricebookEntryId };
					}
				}

				throw new Error('There is no pricebook entry with name: ' + productName);
			} catch (error) {
				console.error('Getting Product ID and Pricebook Entry ID failed:', error);
				throw error;
			}
		});
		return { productId, pricebookEntryId };
	}

	/**
	 * **[Method]** - Change the order status
	 *
	 * *Method functionality* :
	 * - This method has functionality to change the status of the order specified by it's url.
	 *  It also verifies that the order is successfully updated with the correct status.
	 *
	 * @param {string} orderStatus - The status value of the order
	 * @param {string} orderUrl - The URL from the order we want
	 */
	async changeOrderStatus(orderStatus, orderUrl) {
		await allure.step('Change order status to: ' + orderStatus, async () => {
			try {
				const response = await this.request.patch(orderUrl, {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					data: JSON.stringify({ Status: orderStatus }),
				});

				await this.verifications.verifyResponse(response, 204);

				let orderData = { Status: orderStatus };
				await this.verifications.verifyObjectIdAndData('Order', process.env.ORDER_ID, orderUrl, orderData);
			} catch (error) {
				console.error("Change order status to '" + orderStatus + "', has failed: ", error);
				throw error;
			}
		});
	}

	/**
	 * **[Method]** - Get Discount ID
	 *
	 * *Method functionality* :
	 * - This method has functionality to return the discount id by the specified discount name.
	 *
	 * @param {string} discountName - The name of the discount
	 */
	async getDiscountId(discountName) {
		let discountId;
		await allure.step('Get id for the discount: ' + discountName, async () => {
			try {
				const response = await this.request.get(process.env.COMMON_URL + 'query?q=SELECT+Name,Id+FROM+vlocity_cmt__OrderDiscount__c', {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
					},
				});

				const responseData = await response.json();
				const records = responseData.records;
				for (const record of records) {
					if (record.Name === discountName) {
						discountId = record.Id;
						// console.log(typeof discountId);
						// console.log("The id of the discount is: " + discountId);
						return discountId;
					}
				}

				throw new Error('There is no discount with name: ' + discountName);
			} catch (error) {
				console.error('Getting Discount ID failed:', error);
				throw error;
			}
		});
		return discountId;
	}
}
