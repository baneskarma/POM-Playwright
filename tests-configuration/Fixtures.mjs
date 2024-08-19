import { chromium, test as t, expect as e } from "@playwright/test";
//import { page } from './TestsConfig.mjs';
import { getAccessToken } from "./api-config/authentication.js";

import { LoginPage } from "../pages/login-page/LoginPage.js";
import { HomePage } from "../pages/home-page/HomePage.js";
import { CreateAccount } from "../pages/accounts-page/CreateAccount.js";
import { UpdateAccount } from "../pages/accounts-page/UpdateAccount.js";
import { CreateOrder } from "../pages/orders-page/CreateOrder.js";
import { VlocityProductConsole } from "../pages/vlocity-product-console/VPCHomepage.js";

// let loginPage;
// let homePage;
// let createAccount;
// let updateAccount;
// let createOrder;
// let vlocityProductConsole;

/**
 * <b>[Method]</b> - Instances from classes <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function creates instances from  all the classes, so we can use them in our tests. <br>
 */
// export async function pageObjects() {
//     const loginPage = new LoginPage(page);
//     const homePage = new HomePage(page);
//     const createAccount = new CreateAccount(page);
//     const updateAccount = new UpdateAccount(page);
//     const createOrder = new CreateOrder(page);
//     const vlocityProductConsole = new VlocityProductConsole(page);
// };

// export{ loginPage, homePage, createAccount, updateAccount, createOrder, vlocityProductConsole };

// export let browser = await chromium.launch({
//     headless: false,
//     ignoreDefaultArgs: ['--enable-features=NetworkService'],
//     args: ['--disable-popup-blocking'],
//     permissions: ['geolocation'],
// });

// export let context = await browser.newContext(
//     {
//         recordVideo: {
//             dir: 'videos/',
//             size: { width: 1920, height: 1080 }
//         }
//     });

// export let page = await context.newPage();

/**
 * <b>[Method]</b> - Extend the base test function to myTest <br>
 * <br>
 * <i>Method functionality:</i><br>
 * This function extends the base test function, so we are able to use instances of our classes in our tests. <br>
 */
export const test = t.extend({
  // login: async() => {
  //     await browser;
  //     await context;
  //     await page;
  //     let width = 1528;
  //     let height = 742;
  //     await page.setViewportSize({ width: width, height: height });
  //     const loginPage = new LoginPage(page);
  //     await loginPage.login("team.seavus@partner-prod.com.vlocitysbx", "seavusQA123!");
  // },
  // homePage: new HomePage(page),
  // createAccount: new CreateAccount(page),
  // updateAccount: new UpdateAccount(page),
  // createOrder: new CreateOrder(page),
  // vlocityProductConsole: new VlocityProductConsole(page),
});

export const expect = e;

// export const authFixture = t.use({
//     page: [async ({}, use) => {
//         const page = await base.launch(); // Create a new page instance
//         await use(page);
//         // await page.close(); // Close the page after use
//     }, {scope: 'worker'}], // Ensure the page is created per worker

//     salesforceToken: async ({page}, use) => {
//         const accessToken = await getAccessToken({ page });
//         process.env.sfAccessToken = accessToken;
//         console.log("SF Token: " + process.env.sfAccessToken);
//         await use(accessToken); // Ensure any teardown also happens
//     }
// });

// export const authFixture2 = test.use({
//    accessToken: await getAccessToken,
// });

// export { authFixture };
