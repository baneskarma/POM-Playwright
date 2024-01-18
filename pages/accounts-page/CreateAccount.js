import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * <b>PAGES : CPQ : ACCOUNTS</b> [Create]: Create New Account
 */
export class CreateAccount {
    constructor(page) {
        (async() => {
            this.page = page;
            this.orders = page.locator('lst-breadcrumbs').getByText('Orders');
            //this.newButton = page.getByRole('button', { name: 'New' });
            this.newButton = page.locator("//li[@data-target-selection-name='sfdc:StandardButton.Account.New']//div[@title='New']");
            this.acccountType;
            this.nextButton = page.getByRole('button', { name: 'Next' });
            this.accountName = page.getByLabel('*Account Name');
            this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
            this.successMessage = page.getByRole('alertdialog', { name: 'Success' });
        })();
    };

    /**
     * <b>[Method]</b> - Create new account<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality creates new account, selects the type of account we want, and enters the name of the account. <br>
     * <br>
	 * @param {string} typeValue - The type of the account we want to create.
	 * @param {string} nameValue - The name of the account.
	 */
    async newAccount( typeValue, nameValue ) {
        await allure.step("Create new account", async () => {
            await allure.step("Click New", async () => {
                await expect(this.orders).toBeHidden();
                await this.newButton.click();
            });

            await allure.step("Account type: " + typeValue, async () => {
                this.acccountType = this.page.getByText(typeValue, { exact: true });
                await this.acccountType.click();
                await this.nextButton.click();
            });

            await allure.step("Account name: " + nameValue, async () => {
                await this.accountName.click();
                await this.accountName.fill(nameValue);
                await expect(this.accountName).toHaveValue(nameValue);
            });

            await allure.step("Account created successfully", async () => {
                await this.saveButton.click();
                await expect(this.successMessage).toBeVisible();
                await expect(this.successMessage).toBeHidden();
            });
        });
    };
};