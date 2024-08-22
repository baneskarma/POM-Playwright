import { expect, chromium } from '@playwright/test';
import core from '@actions/core';
//const core = require( '@actions/core' );

import express from 'express';
import https from 'https';
import fs from 'fs';
import crypto from 'crypto';
// import opener from 'opener';

const isCI = process.env.CI === 'true';
let authorizationCode;

function generateCodeVerifier() {
	return crypto.randomBytes( 32 ).toString( 'base64' ).replace( /=/g, '' ).replace( /\+/g, '-' ).replace( /\//g, '_' );
}

function generateCodeChallenge( codeVerifier ) {
	const base64Digest = crypto.createHash( 'sha256' ).update( codeVerifier ).digest( 'base64' );
	return base64Digest.replace( /=/g, '' ).replace( /\+/g, '-' ).replace( /\//g, '_' );
}

/**
 * **[Method]** - Create a Server
 *
 * *Method functionality* :
 * - This method has a functionality to create an express application which will act as a simple web server to handle the callback from Salesforce during the OAuth 2.0 authorization code grant flow.
 *
 * *Steps of this scenario* :
 * 1. Create an express application with the same port as in the callback url.
 * 2. Set up SSL certificate and start the server(You will need ssl certificate to redirect from salesforce to a url with HTTPS, so the communication between salesforce and this server is encrypted).
 * 3. Extract the authorization code when a get method is requested for this application to the /callback endpoint.
 *  - **Note**: For now i am using a self signed certificate so there will be a 'Not Secure' warning in the browser of the redirected url.
 */
function createServer() {
	// Step 1:
	const app = express();
	const port = 3000; // if you change the port you should also change the redirect uri in salesforce

	// Step 2:
	let options;
	if ( isCI ) {
		// if key and cert files are encoded in .txt extension use this:
		options = {
			key: Buffer.from( process.env.SSL_KEY, 'base64' ).toString(), // Decode the key
			cert: Buffer.from( process.env.SSL_CERT, 'base64' ).toString(), // Decode the certificate
		};
	} else {
		// if key and cert files are NOT encoded from the .pem extension use this:
		options = {
			key: fs.readFileSync( process.env.KEY_PEM_PATH ),
			cert: fs.readFileSync( process.env.CERT_PEM_PATH ),
		};
	}

	const server = https.createServer( options, app );
	server.listen( port, () => {
		console.log( `Start server on port ${port}` );
	});

	// Step 3:

	app.get( '/callback', ( req, res ) => {
		authorizationCode = req.query.code;
		// process.env.AUTHORIZATION_CODE = authorizationCode;
		console.log( 'Authorization code received:', authorizationCode );
		//res.send('You can close this window.');
		res.writeHead( 200, { 'Content-Type': 'text/plain' });
		res.end( 'You can close this window now.' );
	});

	return server;
}

/**
 * **[Method]** - Get access token through Oauth 2.0
 *
 * *Method functionality* :
 * - This method has functionality to get authorization code from salesforce and exchange it for an access token.
 *
 * *Steps of this scenario* :
 * 1. Create and start the server, then generate the code challenge.
 * 2. Construct Authorization URL, open it and login, then wait for the authorization code to be received by the callback server.
 * 3. Exchange code for access token through a post request.
 * 4. Save the access token to the environment variable ACCESS_TOKEN.
 * **Note**: For now i am using a self signed certificate so there will be a 'Not Secure' warning in the browser of the redirected url.
 */
export const getAccessToken = async () => {
	//export async function  getAccessToken() {

	// Configuration
	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const redirectUri = process.env.REDIRECT_URI;
	const sfUrl = process.env.SF_URL;
	const authorizationUrl = sfUrl + process.env.AUTHORIZATION_ENDPOINT;
	const tokenUrl = sfUrl + process.env.TOKEN_ENDPOINT;

	// set environment variables
	process.env.COMMON_ACCOUNT_URL = process.env.COMMON_URL + process.env.ACCOUNT_ENDPOINT;
	process.env.COMMON_ORDER_URL = process.env.COMMON_URL + process.env.ORDER_ENDPOINT;
	process.env.COMMON_PRODUCT_URL = process.env.COMMON_URL + process.env.PRODUCT_ENDPOINT;
	process.env.COMMON_PRICELIST_URL = process.env.COMMON_URL + process.env.PRICELIST_ENDPOINT;
	process.env.COMMON_ORDER_ITEM_URL = process.env.COMMON_URL + process.env.ORDER_ITEM_ENDPOINT;
	process.env.COMMON_ASSET_URL = process.env.COMMON_URL + process.env.ASSET_ENDPOINT;
	process.env.COMMON_PRICING_VARIABLE_URL = process.env.COMMON_URL + process.env.PRICING_VARIABLE_ENDPOINT;
	// soql query Fields(Standard)
	//  query?q=SELECT+Fields(Standard)+FROM+vlocity_cmt__PricingVariable__c
	// vlocity_cmt__Discount__c

	// ZA SEGA
	// /services/data/v58.0/sobjects/vlocity_cmt__OrderDiscount__c/a3f7a0000001rW1AAI
	// /services/data/v58.0/sobjects/vlocity_cmt__OrderDiscountItem__c/a3d7a000000JOPMAA4
	// /services/data/v58.0/query?q=Select+Fields(Standard)+From+vlocity_cmt__OrderDiscount__c

	// Za 5g network voice reccurring
	// /services/data/v58.0/sobjects/PriceBookEntry/01u7a00000KdZu5AAF
	// /services/data/v58.0/sobjects/Product2/01t7a00000CPXOGAA5

	// Discount kako da napravam na order
	// Da napravam product kako Asset za account.
	// Reccurring kako da proveram.
	// Za hybrid kako ke bide scenarioto.

	console.log( process.env.NODE_ENV );
	console.log( sfUrl );

	// Step 1:
	let server = createServer();
	//process.env.server = server;

	// Generate code verifier and code challenge
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = generateCodeChallenge( codeVerifier );

	// Step 2:
	await expect( async () => {
		const authUrl = `${authorizationUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent( redirectUri )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
		// let childProcess = await opener(authUrl);

		// childProcess.on('exit', (code, signal) => {
		// 	console.log(`Child process exited with code ${code} and signal ${signal}`);
		// });
		let browser;
		let context;
		let page;
		try {
			browser = await chromium.launch({ headless: false }); // { headless: true }
			context = await browser.newContext();
			page = await context.newPage();
			// const redirectUrl = authResponse.url;
			await page.goto( authUrl );
			await page.fill( '#username', process.env.SF_USERNAME );
			await page.fill( '#password', process.env.SF_PASSWORD );
			await page.click( "//input[@id='Login']" );
			// if (!isCI) {
			const advanceButtonLocator = '//button[@id="details-button"]';
			await expect( page.locator( advanceButtonLocator ) ).toBeVisible();
			const advanceButton = page.locator( advanceButtonLocator );
			if ( advanceButton ) {
				await advanceButton.click( advanceButton );
				const proceed = page.locator( '//a[@id="proceed-link"]' );
				await proceed.click();
				// }
			}
		} catch ( error ) {
			console.error( 'Error in UI:', error );
			throw error;
		}

		try {
			while ( !authorizationCode ) {
				await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
			}
		} catch ( error ) {
			console.error( 'Error getting authorization code:', error );
			throw error;
		}

		await context.close();
		await browser.close();

		// Step 3:
		let response;
		let data;
		try {
			response = await fetch( tokenUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code: authorizationCode,
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: redirectUri,
					code_verifier: codeVerifier,
				}),
			});

			if ( !response.ok ) {
				const responseText = await response.text();
				console.warn( 'Response status: ' + response.status + ', Status text: ' + response.statusText + ', Response text: ' + responseText );
				//throw new Error(`Error exchanging code: ${response.status} ${response.statusText} ${responseText}`);
			}

			// Step 4:

			data = await response.json();
			// console.log(data);

			const accessToken = await data.access_token;
			process.env.ACCESS_TOKEN = accessToken;
			console.log( 'SF Token: ' + accessToken );
			core.setOutput( 'ACCESS_TOKEN', accessToken );
			// if (isCI) {
			// 	core.setOutput('ACCESS_TOKEN', accessToken);
			// }
		} catch ( error ) {
			console.error( 'Error in token exchange:', error );
			throw error;
		} finally {
			server.close();
			// childProcess.kill();
			// console.log(childProcess.killed);
		}
	}).toPass({
		intervals: [ 7_000, 14_000, 21_000 ],
		timeout: 26_000,
	});
};

/**
 * **[Method]** - Get access token with password grant type
 *
 * *Method functionality* :
 * - This method has functionality to retrieve an access token from Salesforce using the OAuth 2.0 with password grant flow(type).
 * - It also sets up environment variables for the used salesforce objects in the tests, like commonAccountUrl.
 * *Steps of this scenario* :
 * 1. Create a POST request to the Salesforce token endpoint, sending the client ID, client secret, username and password using the 'password' grant type.
 * 2. Extract the access token from the response.
 * 3. Save the access token to the environment variable sfAccessToken.
 */
const getAuthCode = async () => {
	// Configuration
	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const sfUrl = process.env.SF_URL;
	const tokenUrl = sfUrl + process.env.TOKEN_ENDPOINT;

	await expect( async () => {
		let accessToken;
		try {
			// Step 1:
			const response = await fetch( tokenUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'password',
					client_id: clientId,
					client_secret: clientSecret,
					username: process.env.SF_USERNAME,
					password: process.env.SF_PASSWORD,
				}),
			});

			if ( !response.ok ) {
				const responseText = await response.text();
				throw new Error( `Authentication failed: ${response.status} ${response.statusText}\nResponse Body: ${responseText}` );
			}

			// Step 2:
			const data = await response.json();
			accessToken = data.access_token;

			// Step 3:
			process.env.ACCESS_TOKEN = accessToken;
			console.log( 'SF Token: ' + process.env.ACCESS_TOKEN );
		} catch ( error ) {
			console.error( 'Error obtaining access token:', error );
			throw error;
		}
	}).toPass({
		intervals: [ 2_000, 5_000, 10_000 ],
		timeout: 20_000,
	});
};

/**
 * **[Method]** - Get access token old method
 *
 * *Method functionality* :
 * - This method has functionality to retrieve an access token from Salesforce using the OAuth 2.0 with authorization code grant flow(type).
 * - It also sets up environment variables for the used salesforce objects in the tests, like commonAccountUrl.
 * *Steps of this scenario* :
 * 1. Navigate to the authorization endpoint and login with Salesforce credentials.
 * 2. Extract the authorization code from the redirected URL.
 * 3. Exchange authorization code for access token.
 * 4. Save the access token to the environment variable sfAccessToken.
 */
export const getAccessTokenOld = async () => {
	// Configuration
	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const redirectUri = process.env.REDIRECT_URI;
	const sfUrl = process.env.SF_URL;
	const authorizationUrl = sfUrl + process.env.AUTHORIZATION_ENDPOINT;
	const tokenUrl = sfUrl + process.env.TOKEN_ENDPOINT;

	// set environment variables
	process.env.COMMON_ACCOUNT_URL = process.env.COMMON_URL + process.env.ACCOUNT_ENDPOINT;
	process.env.COMMON_ORDER_URL = process.env.COMMON_URL + process.env.ORDER_ENDPOINT;
	process.env.COMMON_PRODUCT_URL = process.env.COMMON_URL + process.env.PRODUCT_ENDPOINT;
	process.env.COMMON_PRICELIST_URL = process.env.COMMON_URL + process.env.PRICELIST_ENDPOINT;
	process.env.COMMON_ORDER_ITEM_URL = process.env.COMMON_URL + process.env.ORDER_ITEM_ENDPOINT;
	process.env.COMMON_ASSET_URL = process.env.COMMON_URL + process.env.ASSET_ENDPOINT;
	process.env.COMMON_PRICING_VARIABLE_URL = process.env.COMMON_URL + process.env.PRICING_VARIABLE_ENDPOINT;

	console.log( process.env.NODE_ENV );
	console.log( sfUrl );
	let page;

	await expect( async () => {
		// Step 1:
		const browser = await chromium.launch();
		const context = await browser.newContext();
		page = await context.newPage();

		await page.goto( `${authorizationUrl}?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUri}` );
		await page.fill( '#username', process.env.SF_USERNAME );
		await page.fill( '#password', process.env.SF_PASSWORD );
		await page.click( "//input[@id='Login']" );

		// Step 2:
		const redirectUrl = page.url();
		//  console.log(redirectUrl);

		const redirectUrlObj = new URL( redirectUrl );
		//console.log(redirectUrlObj);

		const rawAuthorizationCode = redirectUrlObj.searchParams.get( 'code' );
		//console.log("rawAuthorizationCode: " + rawAuthorizationCode);

		const authorizationCode = decodeURIComponent( rawAuthorizationCode );
		// console.log("authorizationCode: " + authorizationCode);

		// Step 3:
		let response;
		let data;
		let accessToken;
		try {
			response = await fetch( tokenUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code: authorizationCode,
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: redirectUri,
				}),
			});

			// console.log(response);
			if ( !response.ok ) {
				const responseText = await response.text();
				console.warn( 'Response status: ' + response.status + ', Status text: ' + response.statusText + ', Response text: ' + responseText );
				//throw new Error(`Error exchanging code: ${response.status} ${response.statusText} ${responseText}`);
			}

			data = await response.json();
			accessToken = await data.access_token;
		} catch ( error ) {
			console.error( 'Error in token exchange:', error );
			throw error;
		}

		// Step 4:
		process.env.ACCESS_TOKEN = accessToken;
		console.log( 'SF Token: ' + process.env.ACCESS_TOKEN );
	}).toPass({
		intervals: [ 2_000, 5_000, 10_000 ],
		timeout: 20_000,
	});
};
