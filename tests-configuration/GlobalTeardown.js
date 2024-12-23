import { execSync } from 'child_process';
import { createSalt } from './utils/EncryptValue.js';
import { setEnvironment } from './utils/SetEnvironment.js';
import { writeEncryptFile, decryptFile } from './utils/EncryptFile.js';

/**
 * <b>[Global Teardown]</b> - Preform global teardown actions after workers have finished <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to generate allure report, and after that to open the report <br>
 */
export default async function globalTeardown() {
	try {
		// check if running on a CI environment
		const isCI = process.env.CI === 'true';
		if ( !isCI ) {
			const envFile = setEnvironment();
			const decryptedData = decryptFile( envFile, true );
			createSalt();
			writeEncryptFile( envFile, decryptedData );
			execSync( 'allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
			execSync( 'allure open allure-report', { stdio: 'inherit' });
		}
	} catch ( error ) {
		console.error( error );
	}
}
