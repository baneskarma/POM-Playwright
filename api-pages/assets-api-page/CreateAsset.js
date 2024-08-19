import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { Verifications } from '../verifications/Verifications';

/**
 * **PAGES : CPQ : ASSETS** [Create]: Create New Asset
 */
export class CreateAsset {
	constructor( request ) {
		this.request = request;
		this.verifications = new Verifications( this.request );
	}

	/**
	 * **[Method]** - Create new asset
	 *
	 * *Method functionality* :
	 * - This method has functionality to create an asset of the specified product, with it's specified price and quantity, for the specified account.
	 *   Next it will verify that the asset is successfully created with the correct data.
	 *   It also stores the id and url from the created asset in environment variables. process.env.CURRENT_ASSET_URL and process.env.ASSET_ID
	 *
	 * @param {string} accountId - The id of the account connected to the asset
	 * @param {string} productName - The name of the product for the asset
	 * @param {string} price - The price of the product
	 * @param {string} quantity - The quantity of the product
	 */
	async newAsset( accountId, productName, price, quantity ) {
		await allure.step( 'Create new Asset', async () => {
			let assetData;

			const productId = await this.getProductId( productName );
			//console.log(productId);

			await allure.step( 'Store Asset Data', async () => {
				assetData = {
					Name: productName,
					AccountId: accountId,
					Product2Id: productId,
					Price: price,
					Quantity: quantity,
				};
			});

			try {
				const response = await this.request.post( process.env.COMMON_ASSET_URL, {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					data: JSON.stringify( assetData ),
				});

				await this.verifications.verifyResponse( response, 201 );

				await allure.step( 'Retrieving response data', async () => {
					const responseData = await response.json();
					console.log( 'Response from creating asset is Success:', responseData );

					await allure.step( 'Store Asset ID', async () => {
						const assetId = await responseData.id;
						process.env.ASSET_ID = assetId;
						//console.log("Asset ID: " + process.env.ASSET_ID);
					});

					await allure.step( 'Store Asset Url', async () => {
						const assetUrl = process.env.COMMON_ASSET_URL + process.env.ASSET_ID;
						process.env.CURRENT_ASSET_URL = assetUrl;
					});
				});

				await this.verifications.verifyObjectIdAndData( 'Asset', process.env.ASSET_ID, process.env.CURRENT_ASSET_URL, assetData );
			} catch ( error ) {
				console.error( 'Asset creation failed:', error );
				throw error;
			}
		});
	}

	/**
	 * **[Method]** - Get Product ID
	 *
	 * *Method functionality* :
	 * - This method has functionality to return the product id by the specified product name.
	 *
	 * @param {string} productName - The name of the product
	 */
	async getProductId( productName ) {
		let productId;
		await allure.step( 'Get id for the product: ' + productName, async () => {
			try {
				const response = await this.request.get( process.env.COMMON_URL + 'query?q=SELECT+Name,Id+FROM+Product2', {
					headers: {
						Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
					},
				});

				const responseData = await response.json();
				const records = responseData.records;
				for ( const record of records ) {
					if ( record.Name === productName ) {
						productId = record.Id;
						// console.log("The id of product: " + productId);
						return productId;
					}
				}

				throw new Error( 'There is no product with name: ' + productName );
			} catch ( error ) {
				console.error( 'Getting Product ID failed:', error );
				throw error;
			}
		});
		return productId;
	}
}
