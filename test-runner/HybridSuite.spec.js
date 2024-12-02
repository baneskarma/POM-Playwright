import { beforeAllTests, beforeEachTest, afterAllTests } from '../tests-configuration/TestsConfig.mjs';
import { test } from '@playwright/test';
//import { test, expect } from '../tests-configuration/Fixtures.mjs';

import { order5GNetworkVoiceToBusiness } from '../tests/hybrid-tests/A5GNetworkVoiceToBusiness.spec.js';
import { iPhone7ToConsumerB2C } from '../tests/hybrid-tests/IPhone7ToConsumerB2C.spec.js';
import { iPhone8ToBusinessB2B } from '../tests/hybrid-tests/IPhone8ToBusinessB2B.spec.js';

test.beforeAll( beforeAllTests );
test.beforeEach( beforeEachTest );
test.afterAll( afterAllTests );

test.describe.serial( 'Hybrid Test Suite', () => {
	order5GNetworkVoiceToBusiness();
	iPhone7ToConsumerB2C();
	iPhone8ToBusinessB2B();
});
