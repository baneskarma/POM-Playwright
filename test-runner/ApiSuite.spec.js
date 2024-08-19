import { expect, test } from '@playwright/test';
import { getAccessToken } from '../tests-configuration/api-config/Authentication.js';

import { iPhone7ToConsumerB2C } from '../tests/api-tests/IPhone7ToConsumerB2C.spec.js';
import { iPhone8ToBusinessB2B } from '../tests/api-tests/IPhone8ToBusinessB2B.spec.js';
import { add10PercentDiscount6MonthsToResidential } from '../tests/api-tests/Add10PercentDiscount6MonthsToResidential.spec.js';
import { order5GNetworkVoiceToBusiness } from '../tests/api-tests/5GNetwork-VoiceToBusiness.spec.js';
import { verify10Times10GBNational150kr } from '../tests/api-tests/Verify10Times10GBNational150kr.spec.js';
import { verify5GNetworkISP } from '../tests/api-tests/Verify5GNetworkISP.spec.js';
import { verify5GNetworkVoice } from '../tests/api-tests/Verify5GNetworkVoice.spec.js';

//test.beforeAll(getAccessToken);
test.describe.serial('Api Test Suite', () => {
	iPhone7ToConsumerB2C();
	iPhone8ToBusinessB2B();
	add10PercentDiscount6MonthsToResidential();
	order5GNetworkVoiceToBusiness();
	verify10Times10GBNational150kr();
	verify5GNetworkISP();
	verify5GNetworkVoice();
});
