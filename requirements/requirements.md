# Playwright Test Automation Framework

## 1. Overview
- This framework has witten testcases for the Salesforce Vlocity Application using the POM design pattern.
- It has a custom allure report, that's generated after the test run.
- playwright.yml file to run the project on github actions.
- Environment files that contain sensitive information.

## 2. Test Cases

### 2.1. TestCase#1
1. Create Consumer account .
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
