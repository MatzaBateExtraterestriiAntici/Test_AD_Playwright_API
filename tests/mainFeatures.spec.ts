//import { test, expect, request } from '@playwright/test';

/*test('API Test - GET Request', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');
  expect(response.status()).toBe(200);
  console.log(await response.json());
});*/

// apiTest.spec.ts
import { test, expect } from '@playwright/test';
import { CustomAPICalls } from '../_framework/customAPICalls';

import { MainFeaturesMethods } from './mainFeatures.methods';

// Import and use the JSON file for environment variables
import * as fs from 'fs';
const environmentConfigPath = './config/environmentVars.json';
const envVars = JSON.parse(fs.readFileSync(environmentConfigPath, 'utf8'));


test.describe(`API Automation testing for '${envVars.baseURL}'`, () => {
  
  let customAPICalls: CustomAPICalls;

  let expectedStatusCode = 200;
  let howManyParallelCalls = 30;

  test.beforeAll(async () => {
    customAPICalls = new CustomAPICalls(envVars.baseURL);
    await customAPICalls.initializeRequestContext();
  });

  test('GET Request (single) - verify main features', async () => {
    const API = new MainFeaturesMethods(customAPICalls);

    await API.VerifyMainFeaturesForGet(expectedStatusCode);
  });

  test('GET Request (parallel) - verify main features', async () => {
    const API = new MainFeaturesMethods(customAPICalls);

    await API.VerifyMainFeaturesForGetInParallel(expectedStatusCode, howManyParallelCalls);
  });
});