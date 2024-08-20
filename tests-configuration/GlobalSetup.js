import { execSync } from 'child_process';
import { getAccessToken } from './api-config/Authentication.js';

/**
 * **[Global Setup]** - Preform global setup actions before the workers start.
 *
 * *Test Method functionality:*
 * - This method has functionality to get the access token needed for the api authorization, and then to delete the allure-results and videos folders.
 */
export default async function globalSetup() {
	try {
		// check if running on a CI environment
		const isCI = process.env.CI === 'true';
		if (!isCI) {
			execSync('rm -rf allure-results && rm -rf videos', { stdio: 'inherit' });
		}

		if (process.env.API === 'true') {
			await getAccessToken();
		}
	} catch (error) {
		console.error(error);
	}
}

// module.exports = {
//   globalSetup: async() => {

//   }
// };
