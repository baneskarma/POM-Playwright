import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

let applicationName;

export class HomePage {
	constructor( page ) {
		( async () => {
			this.page = page;
			this.appTitleLocator = page.locator( "//*[@class='appName slds-context-bar__label-action slds-context-bar__app-name']//span" );
			this.appLauncher = page.getByRole( 'button', { name: 'App Launcher' });
			this.searchBar = page.getByPlaceholder( 'Search apps and items...' );
			this.appIcon = page.locator( "//p[@class='slds-truncate']" );
			this.scrollBar = page.locator( "//div[@data-aura-class='uiScroller']" );
			this.tabLocator;
			this.frame;
		})();
	}

	/**
	 * **[Method]** - Check the homepage<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality checks the homepage, and if it is not the app we want, it goes to the desired app. <br>
	 * <br>
	 * @param {string} homePage - The name of the application we want to be in.
	 */
	async checkHomepage( homePage ) {
		// Check homepage to see if we should navigate to another app.
		await allure.step( 'Check if homepage app is ' + homePage, async () => {
			applicationName = await this.appTitleLocator.textContent();
			if ( applicationName != homePage ) {
				await allure.step( 'Navigate to app ' + homePage, async () => {
					await this.appLauncher.click();
					await this.searchBar.click();
					await this.searchBar.fill( homePage );
					await this.appIcon.nth( 0 ).click();
					await expect( this.appTitleLocator ).toHaveText( homePage );
				});
			}
			await this.page.waitForLoadState( 'domcontentloaded' );
			await expect( this.page ).toHaveTitle( 'Home | Salesforce' ); //'Recently Viewed | Orders | Salesforce'
		});
	}

	/**
	 * **[Method]** - go to tab(page)<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality navigates to the tab(page) we want. <br>
	 * <br>
	 * @param {string} tabName - The name of the tab(page) we want to be in.
	 */
	async goToTab( tabName ) {
		// Navigate to tab in the application
		await allure.step( 'Navigate to page ' + tabName, async () => {
			applicationName = await this.appTitleLocator.textContent();
			if ( applicationName.includes( 'Console' ) ) {
				this.tabLocator = this.page.getByRole( 'option', { name: tabName });
				await this.tabLocator.click();
			} else {
				this.tabLocator = this.page.locator( "//a[@title='" + tabName + "']" );
				await this.tabLocator.click();
			}
			await this.page.waitForLoadState( 'domcontentloaded' );
		});
	}

	/**
	 * **[Method]** - verify the title of the page<br>
	 * <br>
	 * <i>Method functionality:</i><br>
	 * This functionality verifies the title of the current page. <br>
	 * <br>
	 * @param {string} pageTitle - The title of the page.
	 */
	async checkTitle( pageTitle ) {
		await allure.step( 'Check if page title is ' + pageTitle, async () => {
			await expect( this.page ).toHaveTitle( pageTitle );
		});
	}

	/**
	 * **[Method]** - Change the frame by index
	 *
	 * <i>Method functionality:</i><br>
	 * This functionality changes the frame we want by index.
	 * <br>
	 * @param {number} frameIndex - The title of the page.
	 */
	async changeFrame( frameIndex ) {
		this.frame = await this.page.frames().slice( frameIndex )[0];
	}

	/**
	 * **[Method]** - Refresh the browser
	 *
	 * *Method functionality*:
	 * This functionality refreshes the browser and waits for the content to load.
	 */
	async refreshPage() {
		await allure.step( 'Refresh browser', async () => {
			await this.page.reload();
			await this.page.waitForLoadState( 'load' );
		});
	}
}
