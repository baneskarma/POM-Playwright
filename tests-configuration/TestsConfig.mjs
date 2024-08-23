import { chromium } from '@playwright/test';
//import { test, expect, browser, context, page } from './Fixtures.mjs';

import { LoginPage } from '../pages/login-page/LoginPage.js';
import { HomePage } from '../pages/home-page/HomePage.js';
import { CreateAccount } from '../pages/accounts-page/CreateAccount.js';
import { UpdateAccount } from '../pages/accounts-page/UpdateAccount.js';
import { CreateOrder } from '../pages/orders-page/CreateOrder.js';
import { VlocityProductConsole } from '../pages/vlocity-product-console/VPCHomepage.js';

export let page;
let browser;
let context;
export let loginPage;
export let homePage;
export let createAccount;
export let updateAccount;
export let createOrder;
export let vlocityProductConsole;

/**
 * <b>[Method]</b> - Method to use in test.beforeAll() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function creates browser, context and page objects so we can use them in all the test files.<br>
 */
export const beforeAllTests = async () => {
	//export async function beforeAllTests() {

	// set browser
	browser = await chromium.launch({
		headless: false,
		ignoreDefaultArgs: [ '--enable-features=NetworkService' ],
		args: [ '--disable-popup-blocking' ],
		permissions: [ 'geolocation' ],
	});

	// set browser context
	context = await browser.newContext({
		recordVideo: {
			dir: 'videos/',
			size: { width: 1920, height: 1080 },
		},
	});

	// set page
	page = await context.newPage();

	// set browser width height and position
	let width = 1528;
	let height = 742;
	await page.setViewportSize({ width: width, height: height });

	// set objects of classes

	loginPage = new LoginPage( page );
	homePage = new HomePage( page );
	createAccount = new CreateAccount( page );
	updateAccount = new UpdateAccount( page );
	createOrder = new CreateOrder( page );
	vlocityProductConsole = new VlocityProductConsole( page );

	//return {page, context};
};

/**
 * <b>[Method]</b> - Method to use in test.beforeEach() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function Logs in into salesforce. <br>
 */
export const beforeEachTest = async () => {
	//export async function beforeEachTest() {
	await loginPage.login( process.env.SF_USERNAME, process.env.SF_PASSWORD, false );
};

/**
 * <b>[Method]</b> - Method to use in test.afterAll() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function closes the page and context objects. <br>
 */
export const afterAllTests = async () => {
	//export async function afterAllTests() {
	await page.close();
	await context.close();
};

// const pc = await beforeAllTests();
// const p = pc.page;
// const c = pc.context;

// export const loginPage = new LoginPage(p);
// export const homePage = new HomePage(p);
// export const createAccount = new CreateAccount(p);
// export const updateAccount = new UpdateAccount(p);
// export const createOrder = new CreateOrder(p);
// export const vlocityProductConsole = new VlocityProductConsole(p);
