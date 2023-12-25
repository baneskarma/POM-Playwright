import { chromium } from '@playwright/test';
//import { test, expect, browser, context, page } from './Fixtures.mjs';

import { LoginPage } from '../pages/login-page/LoginPage.js';
import { HomePage } from '../pages/home-page/HomePage.js';
import { CreateAccount } from '../pages/accounts-page/CreateAccount.js';
import { UpdateAccount } from '../pages/accounts-page/UpdateAccount.js';
import { CreateOrder } from '../pages/orders-page/CreateOrder.js';
import { VlocityProductConsole } from '../pages/vlocity-product-console/VPCHomepage.js';


/**
 * <b>[Method]</b> - Method to use in test.beforeAll() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function creates browser, context and page objects so we can use them in all the test files.<br>
 */
export const beforeAllTests = async() => {
//export async function beforeAllTests() {

    // set browser
    let browser = await chromium.launch({
        headless: true,
        ignoreDefaultArgs: ['--enable-features=NetworkService'],
        args: ['--disable-popup-blocking'],
        permissions: ['geolocation'],
        async handleAlertClick() {
          await LightningAlert.open({
            message: "this is the alert message",
            variant: "header", // if headerless, theme not applicable
            theme: "default", 
            label: "Error", // this is the header text
          });
          //Alert has been closed
          
        }
    });

    // set browser context
    let context = await browser.newContext(
    {   
        recordVideo: {
            dir: 'videos/',
            size: { width: 1920, height: 1080 }
        }
    });

    // set page
    let page = await context.newPage();

    // set browser width height and position
    let width = 1528;
    let height = 742;
    await page.setViewportSize({ width: width, height: height });
    
    // set objects of classes
    //pageObjects();
    // loginPage = new LoginPage(page);
    // homePage = new HomePage(page);
    // createAccount = new CreateAccount(page);
    // updateAccount = new UpdateAccount(page);
    // createOrder = new CreateOrder(page);
    // vlocityProductConsole = new VlocityProductConsole(page);

    return {page, context};
};

/**
 * <b>[Method]</b> - Method to use in test.beforeEach() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function Logs in into salesforce. <br>
 */
export const beforeEachTest = async() => {
//export async function beforeEachTest() {

    //const loginPage = new LoginPage(page);
    await loginPage.login("team.seavus@partner-prod.com.vlocitysbx", "seavusQA123!");
};

/**
 * <b>[Method]</b> - Method to use in test.afterAll() <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function closes the page and context objects. <br>
 */
export const afterAllTests = async() => {
//export async function afterAllTests() {
    await p.close();
    await c.close();
};



const pc = await beforeAllTests();
const p = pc.page;
const c = pc.context;

export const loginPage = new LoginPage(p);
export const homePage = new HomePage(p);
export const createAccount = new CreateAccount(p);
export const updateAccount = new UpdateAccount(p);
export const createOrder = new CreateOrder(p);
export const vlocityProductConsole = new VlocityProductConsole(p);

