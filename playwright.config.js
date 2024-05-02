// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();


// How to set the environment:
// inside bash terminal to set: export NODE_ENV=uat to unset: unset NODE_ENV --> inside windows terminal: set NODE_ENV=uat
if (!process.env.NODE_ENV) {
  const relativePath = './tests-configuration/environments/.env';
  const fullPath = path.resolve(relativePath);
  dotenv.config({ path: fullPath });
} else if (process.env.NODE_ENV == "uat") {
  const relativePath = './tests-configuration/environments/.env.uat';
  const fullPath = path.resolve(relativePath);
  dotenv.config({ path: fullPath });
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
// module.exports = defineConfig({
export default defineConfig({
  // testDir: './test-runner',
  testDir: './tests/api-tests/',
  /* Maximum time one test can run for. */
  timeout: 150 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: 15 * 1000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  retries: 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 7 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // ['html'],
    ['allure-playwright', {outputFolder: 'allure-results'}]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    // Video options: 'on', 'off', 'retain-on-failure', 'on-first-retry'
    video: "off", 
    screenshot: 'only-on-failure',   

    launchOptions:{
      slowMo: 500
    },

    // Maximum time each action such as click() can take. Defaults to 0
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://test.salesforce.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer 
      trace options: 'on', 'on-first-retry'
    */
    trace: 'off',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // launchOptions: {
        //   args: ['--start-maximized']
        // },
      }
    },

    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  globalTeardown: "./tests-configuration/GlobalTeardown",
  globalSetup: "./tests-configuration/GlobalSetup",
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

