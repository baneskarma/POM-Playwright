import dotenv from 'dotenv';
import path from 'path';

/**
 * **[Function]** - Set Environment
 *
 * *Functionality* :
 * - This function will set the environment file based on the NODE_ENV value in your laptop or PC. If NODE_ENV is not defined by default it will use the .env file as your environment.
 *
 *  - **Note**: How to set the NODE_ENV value:
 *      - inside bash terminal
 *          - to set: export NODE_ENV=uat
 *          - to unset: unset NODE_ENV
 *          - to print: echo $NODE_ENV
 *      - inside windows terminal:
 *          - to set: set NODE_ENV=uat,
 *          - to unset: unset NODE_ENV
 *          - to print: echo %NODE_ENV%
 */
export function setEnvironment() {
	let relativePath = './tests-configuration/environments/.env';
	if ( process.env.NODE_ENV ) {
		relativePath = relativePath + process.env.NODE_ENV;
	}
	const fullPath = path.resolve( relativePath );
	dotenv.config({ path: fullPath });
	return fullPath;
}
