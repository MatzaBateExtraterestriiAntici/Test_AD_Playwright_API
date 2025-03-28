import { test, expect } from '@playwright/test';
import { CustomAPICalls } from '../_framework/customAPICalls';

import { MainFeaturesMethods } from './mainFeatures.methods';

// Import and use the JSON file for environment variables
import * as fs from 'fs';
const environmentConfigPath = './config/environmentVars.json';
const envVars = JSON.parse(fs.readFileSync(environmentConfigPath, 'utf8'));


test.describe(`API Automation testing for '${envVars.baseURL}'`, () => {
  
  let customAPICalls: CustomAPICalls;

  let expectedStatusCodeGet = 200;
  let expectedStatusCodePost = 201;
  let howManyParallelCalls = 30;

  test.beforeAll(async () => {
    customAPICalls = new CustomAPICalls(envVars.baseURL);
    await customAPICalls.initializeRequestContext();
  });

  test('GET Request (single) - verify main features', async () => {
    const API = new MainFeaturesMethods(customAPICalls);

    await API.VerifyMainFeaturesForGet(expectedStatusCodeGet);
  });

  test('GET Request (parallel) - verify main features', async () => {
    const API = new MainFeaturesMethods(customAPICalls);

    await API.VerifyMainFeaturesForGetInParallel(expectedStatusCodeGet, howManyParallelCalls);
  });

  test('POST Request (single) - verify main features', async () => {
    const API = new MainFeaturesMethods(customAPICalls);

    await API.VerifyMainFeaturesForPost(expectedStatusCodePost);
  });

});