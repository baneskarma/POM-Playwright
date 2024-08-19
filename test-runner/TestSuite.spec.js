import {
  beforeAllTests,
  beforeEachTest,
  afterAllTests,
} from "../tests-configuration/TestsConfig.mjs";
import { expect, test } from "@playwright/test";
//import { test, expect } from '../tests-configuration/Fixtures.mjs';

import { order5GNetworkVoiceToBusiness } from "../tests/ui-tests/5GNetwork-VoiceToBusiness.js";
import { add10PercentDiscount6MonthsToResidential } from "../tests/ui-tests/Add10PercentDiscount6MonthsToResidential.js";
import { iPhone7ToConsumerB2C } from "../tests/ui-tests/IPhone7ToConsumerB2C.js";
import { iPhone8ToBusinessB2B } from "../tests/ui-tests/IPhone8ToBusinessB2B.js";
import { verify5GNetworkISP } from "../tests/ui-tests/Verify5GNetworkISP.js";
import { verify5GNetworkVoice } from "../tests/ui-tests/Verify5GNetworkVoice.js";
import { verify10Times10GBNational150kr } from "../tests/ui-tests/Verify10Times10GBNational150kr.js";
import { zeroStepDemo } from "../tests/ui-tests/zeroStepDemo.js";

test.beforeAll( beforeAllTests );
test.beforeEach( beforeEachTest );
test.afterAll( afterAllTests );

test.describe( "Test Suite", () => {
  // zeroStepDemo();
  order5GNetworkVoiceToBusiness();
  add10PercentDiscount6MonthsToResidential();
  iPhone7ToConsumerB2C();
  iPhone8ToBusinessB2B();
  verify5GNetworkISP();
  verify5GNetworkVoice();
  verify10Times10GBNational150kr();
});
