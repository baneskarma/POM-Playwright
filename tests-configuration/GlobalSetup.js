import { execSync } from 'child_process';

/**
 * <b>[Global Setup]</b> - Preform global setup actions before the workers start. <br>
 * <br>
 * <i>Test Method functionality:</i><br>
 * This method has functionality to delete the allure-results and videos folders <br>
 */
export default async function globalSetup() {
  try {
    // check if running on a CI environment
    const isCI = process.env.CI === 'true';
    if(!isCI) {
      execSync('rm -rf allure-results && rm -rf videos', { stdio: 'inherit' });
    };
  } catch (error) {
    console.error(error);
  }

};
