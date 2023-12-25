import { expect } from '@playwright/test';
let applicationName;

export class HomePage {
    constructor(page) {
        (async() => {
            this.page = page;
            this.appTitleLocator = page.locator("//*[@class='appName slds-context-bar__label-action slds-context-bar__app-name']//span");
            this.appLauncher = page.getByRole('button', { name: 'App Launcher' });
            this.searchBar = page.getByPlaceholder('Search apps and items...');
            this.appIcon = page.locator("//p[@class='slds-truncate']");
            this.scrollBar = page.locator("//div[@data-aura-class='uiScroller']");
            this.tabLocator;
            this.frame;
        })();
    };

    /**
     * <b>[Method]</b> - Check the homepage<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality checks the homepage, and if it is not the app we want, it goes to the desired app. <br>
     * <br>
	 * @param {string} homePage - The name of the application we want to be in.
	 */
    async checkHomepage( homePage ) {

        // Check homepage to see if we should navigate to another app.

        applicationName = await this.appTitleLocator.textContent();
        if (applicationName != homePage) {
            await this.appLauncher.click();
            await this.searchBar.click();
            await this.searchBar.fill(homePage);
            await this.appIcon.nth(0).click();
            await expect(this.appTitleLocator).toHaveText(homePage);
        };
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveTitle("Recently Viewed | Orders | Salesforce");
    };

    /**
     * <b>[Method]</b> - go to tab(page)<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality navigates to the tab(page) we want. <br>
     * <br>
	 * @param {string} tabName - The name of the tab(page) we want to be in.
	 */
    async goToTab( tabName ) {

        // Navigate to tab in the application

        applicationName = await this.appTitleLocator.textContent();
        if(applicationName.includes("Console")) {
            this.tabLocator = this.page.getByRole('option', { name: tabName });
            await this.tabLocator.click();
        }else {
            this.tabLocator = this.page.getByRole('link', { name: tabName });
            await this.tabLocator.click();
        };
        await this.page.waitForLoadState('domcontentloaded');
    };

    /**
     * <b>[Method]</b> - verify the title of the page<br>
     * <br>
     * <i>Method functionality:</i><br>
     * This functionality verifies the title of the current page. <br>
     * <br>
     * @param {string} pageTitle - The title of the page.
     */
    async checkTitle( pageTitle ) {       
        await expect(this.page).toHaveTitle(pageTitle);
    };

    /**
     * <b>[Method]</b> - Change the frame by index<br>
     * <br>
     * <i>Method functionality:</i><br>
     * This functionality changes the frame we want by index. <br>
     * <br>
     * @param {number} frameIndex - The title of the page.
     */
    async changeFrame( frameIndex ) {
        this.frame = await this.page.frames().slice( frameIndex )[0];
    };
};