import { execSync } from 'child_process';
import { getAccessToken } from './api-config/Authentication.js';
import { createSalt } from './utils/EncryptValue.js';
import { setEnvironment } from './utils/SetEnvironment.js';
import { writeEncryptFile, decryptFile } from './utils/EncryptFile.js';

/**
 * **[Global Setup]** - Preform global setup actions before the workers start.
 *
 * *Test Method functionality:*
 * - This method has functionality to:
 *      - delete the allure-results and videos folders.
 *      - set the environment.
 *      - Encrypt the environment if it's not encrypted and write the encrypted values to it.
 *      - Decrypt the values from the environment so we can use them at runtime.
 *      - get the access token needed for the api authorization.
 */
export default async function globalSetup() {
	try {
		// test values
		// const mySalt = createSalt();
		// console.log(mySalt);
		// console.log(process.env.SALT);
		// const myText = 'Hello World';
		// const encryptedData = encrypt(myText, process.env.SALT);
		// console.log('Encrypted data:', encryptedData);
		// const decryptedData = decrypt(encryptedData, process.env.SALT);
		// console.log('Decrypted data:', decryptedData);
		// const encryptedData2 = encrypt(myText, mySalt);
		// console.log('Encrypted data 2:', encryptedData2);
		// const decryptedData2 = decrypt(encryptedData2, mySalt);
		// console.log('Decrypted data:', decryptedData2);
		// process.exit();

		// check if running on a CI environment
		const isCI = process.env.CI === 'true';
		if ( !isCI ) {
			execSync( 'rm -rf allure-results && rm -rf videos', { stdio: 'inherit' });

			const envFile = setEnvironment();
			if ( !process.env.SALT ) {
				// env file encryption
				createSalt();
				writeEncryptFile( envFile, null );
				console.error( 'The program has stopped, because the env file was not encrypted.\nEncryption has been done, you can start the program again.' );
				process.exit( 1 );
			}
			// Decrypt env file
			decryptFile( envFile );
			// process.exit();
		}

		if ( process.env.API === 'true' ) {
			await getAccessToken();
		}
	} catch ( error ) {
		console.error( error );
	}
}
