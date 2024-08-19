import { test, expect } from '@playwright/test';
//import { LoginPage } from '../pages/login-page/LoginPage.js';
//import { loginPage } from '../tests-configuration/TestsConfig.mjs';

test('OAuth 2.0 Authorization Code Flow with Salesforce', async ({ page }) => {

  // Configuration
  const clientId = process.env.clientId;
  const clientSecret = process.env.clientSecret;
  const redirectUri = process.env.redirectUri;
  const sfUrl = process.env.sfUrl;
  const authorizationEndpoint = sfUrl + process.env.authorizationEndpoint;
  const tokenEndpoint = sfUrl + process.env.tokenEndpoint;

  // console.log(process.env.NODE_ENV);

  // 1. Redirect to authorization endpoint and login with Salesforce credentials
  await page.goto(`${process.env.sfUrl + process.env.authorizationEndpoint}?response_type=code&client_id=${process.env.clientId}&redirect_uri=${redirectUri}`);

  // let loginPage = new LoginPage(page);
  // await loginPage.login("team.seavus@partner-prod.com.vlocitysbx", "seavusQA123!");
  await page.fill('#username', process.env.sfUsername);
  await page.fill('#password',  process.env.sfPassword);
  await page.click("//input[@id='Login']");

  // 2. Extract authorization code from redirect URL
  const redirectUrl = await page.url();
  // console.log("redirectUrl: " + redirectUrl);

  const redirectUrlObj = new URL(redirectUrl); 
  // console.log(redirectUrlObj);

  const rawAuthorizationCode = redirectUrlObj.searchParams.get('code');
  // console.log("rawAuthorizationCode: " + rawAuthorizationCode);

  const authorizationCode = decodeURIComponent(rawAuthorizationCode);
  console.log("authorizationCode: " + authorizationCode);

  // 3. Exchange code for access token (server-side or secure fetch)
  let response;
  let data;
  let accessToken;
  try {
    response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      })
    });

    // console.log(response);
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error exchanging code: ${response.status} ${response.statusText} ${responseText}`);
    };

    data = await response.json();
    accessToken = data.access_token;
    
  } catch (error) {
    console.error("Error in token exchange:", error);
    throw error;
    // if (error.message.includes("invalid_grant")) {
    //   // Restart the authorization flow to get a new code
    //   await page.goto(`${process.env.sfUrl + process.env.authorizationEndpoint}?response_type=code&client_id=${process.env.clientId}&redirect_uri=${redirectUri}`);
    // } else {
    //   throw error;
    // };
  };

  console.log("access token: " + accessToken);
  console.log("data: " + data);

  process.env.sfAccessToken = accessToken;
  console.log("SF Token: " + process.env.sfAccessToken);


  // 6. Use access token for API requests
  // await page.request.post('https://api.salesforce.com/services/data/v58.0/sobjects/Account', {
  //   headers: {
  //     'Authorization': `Bearer ${accessToken}`,
  //     // ...other headers
  //   },
  //   data: {
  //     // Account data
  //   }
  // });
});
