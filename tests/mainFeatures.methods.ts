import { iMainFeaturesMethods } from '../_interfaces/iMainFeaturesMethods';

import { CustomAPICalls } from '../_framework/customAPICalls';
import { CustomValidations } from '../_framework/customValidations';

// Import and use the JSON file for test variables
import * as fs from 'fs';
const testConfigPath = './config/testingVars.json';
const testVars = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));

export class MainFeaturesMethods implements iMainFeaturesMethods {

    private customAPICalls: CustomAPICalls;
    private customValidations = new CustomValidations();

    // Constructor receives the element CustomAPICalls
    constructor(customAPICalls: CustomAPICalls) {
        this.customAPICalls = customAPICalls;
    }

    async VerifyMainFeaturesForGetInParallel(expectedStatus: number, howManyParallelCalls: number) {
        // Perform the request and retrive the response given
        const responses = await this.customAPICalls.GET_PARALLEL('users/2', { }, expectedStatus, howManyParallelCalls, testVars.timeoutLarge);
        // 🔄 Verify all responses
        for (const response of responses) {
            // ✅ Perform the validations
            this.PerformStandardFeatureValidationsForGet(response);
        }
    }

    async VerifyMainFeaturesForGet(expectedStatus: number) {
        // Perform the request and retrive the response given
        const response = await this.customAPICalls.GET('users/2', { }, expectedStatus, testVars.timeoutMedium);
        // ✅ Perform the validations
        this.PerformStandardFeatureValidationsForGet(response);
    }

    /*  //////////              INTERNAL METHODS              ////////// */

    private PerformStandardFeatureValidationsForGet(response) {
        // Easily reference data and support JSON elements
        const data = response.data;
        const support = response.support; 
        // Declare all validations to be performed
        const validationElements = new Map<any, any>([
            [data.id, 2],
            [data.email, 'janet.weaver@reqres.in'],
            [data.first_name, 'Janet'],
            [data.last_name, 'Weaver'],
            [data.avatar, 'https://reqres.in/img/faces/2-image.jpg'],
            [support.url, 'https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral'],
            [support.text, 'Tired of writing endless social media content? Let Content Caddy generate it for you.']
        ]);
          
        // 🔄 Perform all validations from the map object
        validationElements.forEach( (key, value) => {
            this.customValidations.expect_are_equal(key, value);
        });
    }
}