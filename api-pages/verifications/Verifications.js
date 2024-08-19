import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * **VERIFICATIONS : CPQ : OBJECTS** [Verify]: Verify Objects
 */
export class Verifications {
	constructor(request) {
		//   this.response = response;
		this.request = request;
	}

	/**
	 * **[Method]** - Verify response from request
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify if the specified response of a request is ok, and to verify the status code of that request.
	 *
	 * @param {object} response - The response of a request.
	 * @param {number} statusCode - The expected status code of the request
	 */
	async verifyResponse(response, statusCode) {
		await allure.step('Response is ok and status code is ' + statusCode.toString(), async () => {
			expect(response.ok()).toBeTruthy();
			expect(await response.status()).toBe(statusCode);
		});
	}

	/**
	 * **[Method]** - Verify Object's ID and Data
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify the creation or update of the specified object type. Then it verifies the specified ID and Data for the object.
	 *
	 * @param {string} objectType - The type of the object. Eg. 'Account', 'Order' etc.
	 * @param {string} objectId - The ID of the object
	 * @param {string} objectUrl - The URL of the Object
	 * @param {object} objectData - The data of the object, represented by key:value pairs. The keys should be the api field name.
	 */
	async verifyObjectIdAndData(objectType, objectId, objectUrl, objectData) {
		await allure.step('Verify ' + objectType + ' was successfully created or updated', async () => {
			let response;
			let responseObjectData;
			try {
				response = await this.request.get(objectUrl, {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
					},
				});

				this.verifyResponse(response, 200);

				await allure.step('Get response data ', async () => {
					responseObjectData = await response.json();
					//console.log("Data: ", responseObjectData);
					//console.log("Object ID: ", responseObjectData.Id)
				});

				await allure.step('Verify ' + objectType + ' has ID: ' + objectId, async () => {
					expect(responseObjectData.Id).toBe(objectId);
				});

				if (objectType === 'Account') {
					await this.verifyAccountData(responseObjectData, objectData);
				} else if (objectType === 'Order') {
					//console.log("Data: ", responseObjectData);
					await this.verifyOrderData(responseObjectData, objectData);
				} else if (objectType === 'OrderItem') {
					await this.verifyOrderItemData(responseObjectData, objectData);
					//console.log("Data: ", responseObjectData);
				} else if (objectType === 'Asset') {
					await this.verifyAssetData(responseObjectData, objectData);
					//console.log("Data: ", responseObjectData);
				}
			} catch (error) {
				console.error(objectType + ' verification failed:', error);
				throw error;
			}
		});
	}

	/**
	 * **[Method]** - Verify Account's Data
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify the specified data of the account.
	 * It compares the given responseData with the objectData.
	 *
	 * @param {object} responseData - The json response of a request.
	 * @param {object} objectData - The data we want to veirfy of the account represented by key:value pairs.
	 */
	async verifyAccountData(responseData, objectData) {
		await allure.step('Verify Account Data', async () => {
			if (typeof objectData.name === 'string' && objectData.name.trim().length > 0) {
				await allure.step('Verify Account Name is: ' + objectData.name, async () => {
					expect(responseData.Name).toBe(objectData.name);
					expect(responseData).toHaveProperty('Name', objectData.name);
				});
			}

			if (typeof objectData.type === 'string' && objectData.type.trim().length > 0) {
				await allure.step('Verify Account Type is: ' + objectData.type, async () => {
					expect(responseData.Type).toBe(objectData.type);
				});
			}

			if (typeof objectData.phone === 'string' && objectData.phone.trim().length > 0) {
				await allure.step('Verify Account Phone is: ' + objectData.phone, async () => {
					expect(responseData.Phone).toBe(objectData.phone);
				});
			}

			if (typeof objectData.billingStreet === 'string' && objectData.billingStreet.trim().length > 0) {
				await allure.step('Verify Account billing street is: ' + objectData.billingStreet, async () => {
					expect(responseData.BillingStreet).toBe(objectData.billingStreet);
				});
			}

			if (typeof objectData.billingPostalCode === 'string' && objectData.billingPostalCode.trim().length > 0) {
				await allure.step('Verify Account billing postal code is: ' + objectData.billingPostalCode, async () => {
					expect(responseData.BillingPostalCode).toBe(objectData.billingPostalCode);
				});
			}

			if (typeof objectData.billingCity === 'string' && objectData.billingCity.trim().length > 0) {
				await allure.step('Verify Account billing city is: ' + objectData.billingCity, async () => {
					expect(responseData.BillingCity).toBe(objectData.billingCity);
				});
			}

			if (typeof objectData.billingProvince === 'string' && objectData.billingProvince.trim().length > 0) {
				await allure.step('Verify Account billing province is: ' + objectData.billingProvince, async () => {
					expect(responseData.BillingProvince).toBe(objectData.billingProvince);
				});
			}

			if (typeof objectData.billingCountry === 'string' && objectData.billingCountry.trim().length > 0) {
				await allure.step('Verify Account billing country is: ' + objectData.billingCountry, async () => {
					expect(responseData.BillingCountry).toBe(objectData.billingCountry);
				});
			}
		});
	}

	/**
	 * **[Method]** - Verify Order's Data
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify the specified data of the order.
	 * It compares the given responseData with the objectData.
	 *
	 * @param {object} responseData - The json response of a request.
	 * @param {object} objectData - The data we want to veirfy of the order, represented by key:value pairs.
	 */
	async verifyOrderData(responseData, objectData) {
		await allure.step('Verify Order Data', async () => {
			if (typeof objectData.AccountId === 'string' && objectData.AccountId.trim().length > 0) {
				await allure.step('Verify Order Account ID is: ' + objectData.AccountId, async () => {
					expect(responseData).toHaveProperty('AccountId', objectData.AccountId);
					expect(responseData.AccountId).toBe(objectData.AccountId);
				});
			}

			if (typeof objectData.EffectiveDate === 'string' && objectData.EffectiveDate.trim().length > 0) {
				await allure.step('Verify Order Start Date is: ' + objectData.EffectiveDate, async () => {
					expect(responseData).toHaveProperty('EffectiveDate', objectData.EffectiveDate);
				});
			}

			if (typeof objectData.Status === 'string' && objectData.Status.trim().length > 0) {
				await allure.step('Verify Order Status is: ' + objectData.Status, async () => {
					expect(responseData).toHaveProperty('Status', objectData.Status);
				});
			}

			if (typeof objectData.vlocity_cmt__PriceListId__c === 'string' && objectData.vlocity_cmt__PriceListId__c.trim().length > 0) {
				await allure.step('Verify Order Price list is ' + objectData.priceListName + ', with id: ' + objectData.vlocity_cmt__PriceListId__c, async () => {
					expect(responseData).toHaveProperty('vlocity_cmt__PriceListId__c', objectData.vlocity_cmt__PriceListId__c);
				});
			}

			if (typeof objectData.discountName === 'string' && objectData.discountName.trim().length > 0) {
				await allure.step("Verify Order has Discount '" + objectData.discountName + "', with id: " + objectData.vlocity_cmt__Discount__c, async () => {
					expect(responseData).toHaveProperty('vlocity_cmt__Discount__c', objectData.vlocity_cmt__Discount__c);
				});
			}
		});
	}

	/**
	 * **[Method]** - Verify Order Item's Data
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify the specified data of the Order Item.
	 * It compares the given responseData with the objectData.
	 *
	 * @param {object} responseData - The json response of a request.
	 * @param {object} objectData - The data we want to veirfy of the order item represented by key:value pairs.
	 */
	async verifyOrderItemData(responseData, objectData) {
		await allure.step('Verify Order Item Data', async () => {
			let quantity = parseInt(objectData.Quantity);
			let unitPrice = parseInt(objectData.UnitPrice);
			let totalPrice = quantity * unitPrice;
			//let totalCharges = (parseInt(objectData.Quantity) * parseInt(objectData.UnitPrice)).toString();

			await allure.step('Verify Order Item has Order with ID: ' + objectData.OrderId, async () => {
				expect(responseData).toHaveProperty('OrderId', objectData.OrderId);
				expect(responseData.OrderId).toBe(objectData.OrderId);
			});

			await allure.step('Verify Order Item has product with ID: ' + objectData.Product2Id, async () => {
				expect(responseData).toHaveProperty('Product2Id', objectData.Product2Id);
			});

			await allure.step('Verify Order Item has PricebookEntry ID: ' + objectData.PricebookEntryId, async () => {
				expect(responseData).toHaveProperty('PricebookEntryId', objectData.PricebookEntryId);
			});

			await allure.step('Verify Order Item has Quantity of: ' + objectData.Quantity, async () => {
				expect(responseData).toHaveProperty('Quantity', quantity);
			});

			await allure.step('Verify Order Item has UnitPrice of: ' + objectData.UnitPrice, async () => {
				expect(responseData).toHaveProperty('UnitPrice', unitPrice);
			});

			await allure.step('Verify Order Item has Total Price of: ' + totalPrice, async () => {
				expect(responseData).toHaveProperty('TotalPrice', totalPrice);
			});
		});
	}

	/**
	 * **[Method]** - Verify Asset's Data
	 *
	 * *Method functionality* :
	 * - This method has functionality to verify the specified data of the Asset.
	 * It compares the given responseData with the objectData.
	 *
	 * @param {object} responseData - The json response of a request.
	 * @param {object} objectData - The data we want to veirfy of the asset represented by key:value pairs.
	 */
	async verifyAssetData(responseData, objectData) {
		await allure.step('Verify Asset Data', async () => {
			let quantity = parseInt(objectData.Quantity);
			let price = parseInt(objectData.Price);
			let totalPrice = quantity * price;

			await allure.step('Verify Asset has name: ' + objectData.Name, async () => {
				expect(responseData).toHaveProperty('Name', objectData.Name);
				expect(responseData.Name).toBe(objectData.Name);
			});

			await allure.step('Verify Asset has product with ID: ' + objectData.Product2Id, async () => {
				expect(responseData).toHaveProperty('Product2Id', objectData.Product2Id);
			});

			await allure.step('Verify Asset has account with ID: ' + objectData.AccountId, async () => {
				expect(responseData).toHaveProperty('AccountId', objectData.AccountId);
			});

			await allure.step('Verify Asset has Quantity of: ' + objectData.Quantity, async () => {
				expect(responseData).toHaveProperty('Quantity', quantity);
			});

			await allure.step('Verify Asset has Price of: ' + objectData.Price, async () => {
				expect(responseData).toHaveProperty('Price', price);
			});
		});
	}
}
