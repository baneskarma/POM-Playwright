# Playwright Test Automation Framework

## 1. Overview

- This framework has written testcases for the Salesforce Vlocity Application using the POM design pattern.
- The framework has implemented api automation using Oauth 2.0 authorization with pkce.
- It has a custom allure report, that's generated after the test run.
- playwright.yml file to run the project on github actions.
- Environment files that contain sensitive information.
- Custom rules for formatting and linting using eslint and prettier. You need to have eslint and prettier as vscode extensions.

## 2. Test Cases

### 2.1. TestCase#1

1. Create Consumer account.
2. Update account for "Billing Address" with following details: Billing street and Billing city
3. Create Order for account created in step1. Provide mandatory fields (Account Name, Order start date and Status) and Price list ( select "B2C Product Price List: )
4. Add "Apple iPhone 7" product to the order created in step3. Provide following details "Quantity" = 2 and Unit Price = 50
5. Verify that total price for product is 100

### 2.2. TestCase#2

1. Create Business account . Provide mandatory fields only i.e. "Account Name" only
2. Update account for "Billing Address" with following details: Billing street and Billing city
3. Create Order for account created in step1. Provide mandatory fields (Account Name, Order start date and Status) and Price list ( select "B2B Product Price List: )
4. Add "Apple iPhone 8" product to the order created in step3. Provide following details "Quantity" = 3 and Unit Price = 20
5. Verify that total price for product is 60

### 2.3. TestCase#3

1. Login to the Salesforce
2. Create a new 'Business' account on date: 01.12.2020
3. Add product '5G Network - Voice' to the account
4. Verify that product is added to account successfully
5. Verify the recurring charges

### 2.4. TestCase#4

1. Login to the Salesforce
2. Create a new 'Residential' account on date: 30.05.2020
3. Add discount product "10% Discount - 6 months to the account
4. Verify that product is added to account successfully
5. Verify discount duration and discount percentage

### 2.5. TestCase#5

1. Log in to Salesforce
2. Verify the product '5G Network - Voice' exists and has the following details:
   - **Tariff Type**: Recurring
   - **Charging**: Advance
   - **Package Type**: Voice

### 2.6. TestCase#6

1. Log in to Salesforce
2. Verify the product '5G Network - ISP' exists and has the following details:
   - **Tariff Type**: Recurring
   - **Charging**: Advance
   - **Package Type**: ISP

### 2.7. TestCase#7

1. Log in to Salesforce
2. Verify the product '10Times 10GB National 150kr' exists and has the following details:
   - **Name**: 10Times 10GB National 150kr
   - **Product family**: Bundle
   - **Package Type**: Voice
   - **Customer Type**: Business
   - **Charging**: Advanced
   - **Verify the product have following child products:**
   - **Product Name**: "Free National Mobile & Fixed Calls - 600min"
   - **Product Name**: "Free National Data - 100GB"
   - **Product Name**: "Free 100 SMS & MMS"

## 3. Development Dependencies

### 3.1. Dependencies for prettier and eslint.

1. Install eslint and prettier into vs code as extensions.

2. Install eslint and prettier into the project

   - npm install eslint prettier --save-dev

3. Install prettier config and plugin packages

   - npm install eslint-config-prettier --save-dev
   - npm install eslint-plugin-prettier --save-dev

4. Create a lint config file

   - npx eslint --init

5. Install the compat plugin to enable both browser and node environments.

   - the compat plugin is essential for ensuring that your UI tests are compatible with your target browsers while still allowing you to lint your API tests effectively.

   - npm install eslint-plugin-compat --save-dev

6. Install stylistic plugin for eslint
   - npm install @stylistic/eslint-plugin-js --save-dev

7. Naming conventions for formatting
   - You will need this for the plugins that include formatting
      - Formatting :	Name
      - helloWorld :	CAMEL_CASE
      - HelloWorld :	PASCAL_CASE
      - hello_world : SNAKE_CASE
      - hello-world : KEBAB_CASE
      - HELLO_WORLD : SCREAMING_SNAKE_CASE
      - helloworld :	FLAT_CASE

8. Install typescript eslint plugin and parser to use naming conventions.
   - npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

9. Install plugin for formatting filenames and directories.
   - npm install eslint-plugin-check-file --save-dev
   
### 3.2. Husky
1. Install husky dependency, and create a .husky file
   - npm install husky --save-dev
   - npx husky-init

## 4. Custom Shortcuts

### 4.1. Lint current file
-  Command: ctrl + l ctrl + m
-  This is a shortcut that will run the task with label 'Lint Current File' in the tasks.json file. This task runs a command to lint the file which is currently opened and in focus.

### 4.2. Open Playwright Test explorer.
-  Command: ctrl + p ctrl + l