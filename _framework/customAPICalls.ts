import test, { expect, request, APIRequestContext, APIResponse  } from '@playwright/test';
import { iCustomAPICalls } from '../_interfaces/iCustomAPICalls.js';

// Import and use the JSON file for test variables
import * as fs from 'fs';
const testConfigPath = './config/testingVars.json';
const testVars = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));

export class CustomAPICalls implements iCustomAPICalls {

    private requestContext: APIRequestContext;
    private baseURL: string;

    // The API used will return the response header with the type: "application/json; charset=utf-8"
    private contentTypeOfResponseHeader = "application/json; charset=utf-8";

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async initializeRequestContext() {
        this.requestContext = await request.newContext();
    }

    /*  //////////              GET METHODS              ////////// */

    // Custom action to perform a GET request, verify it's status and return the JSON response body
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      JSON representation of the response body
    async GET(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number, timeout: number = testVars.timeoutMedium ): Promise<any> {
        try {
            // Perform the API call required
            const response = await this.PerformGETRequest(endpoint, headers, timeout);
            /// Assert that the response header ccontent-type is the expected one
            expect(response.headers()['content-type']).toBe(this.contentTypeOfResponseHeader);
            // Assert that the status code is the expected one
            expect(response.status()).toBe(expectedResponseCode);
            // Return the response as a JSON representation of the response body
            return response.json();
        }
        catch(error) {
            console.error(`Error encountered on GET call: '${this.baseURL}${endpoint}' !`);
            console.error("More information: ", error);
        }
    }

    // Custom action to perform several GET requests in parallel, verify their status and return the JSON response bodies
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      howManyParallelCalls = number
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      JSON representation of the response body
    async GET_PARALLEL(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number, howManyParallelCalls: number, timeout: number = testVars.timeoutMedium ): Promise<any> {
        try {
            // Perform the API call required
            const responses = await this.PerformSeveralGETRequestInParallel(endpoint, headers, howManyParallelCalls, timeout);
            // Create the empty JSON array to be returned
            let jsonArray: Promise<any>[] = [];
            // 🔄 Verify all responses
            for (const response of responses) {
                // Assert that the response header ccontent-type is the expected one
                expect(response.headers()['content-type']).toBe(this.contentTypeOfResponseHeader);
                // Assert that the status code is the expected one
                expect(response.status()).toBe(expectedResponseCode);
                // Parse the response body as JSON
                jsonArray.push(await response.json());
            }
            // Return the response as a JSON representation of the response body
            return jsonArray;
        }
        catch(error) {
            console.error(`Error encountered on ${howManyParallelCalls} parallel GET call: '${this.baseURL}${endpoint}' !`);
            console.error("More information: ", error);
        }
    }

    /*  //////////              POST METHODS              ////////// */

    // Custom action to perform a POST request, verify it's status and return the JSON response body
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      JSON representation of the response body
    async POST(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number, timeout: number = testVars.timeoutLarge ): Promise<[JSON, Date]> {
        try {
            // Perform the API call required
            const response = await this.PerformPOSTRequest(endpoint, headers, timeout);
            // Assert that the response header ccontent-type is the expected one
            expect(response[0].headers()['content-type']).toBe(this.contentTypeOfResponseHeader);
            // Assert that the status code is the expected one
            expect(response[0].status()).toBe(expectedResponseCode);
            // Return the response as a JSON representation of the response body
            return [await response[0].json(), response[1]]; //new Map<string, { selector: string; expectedText: string }>();
        }
        catch(error) {
            console.error(`Error encountered on POST call: '${this.baseURL}${endpoint}' !`);
            console.error("More information: ", error);
            // Forcefully fail the test
            test.fail(true);
            return [JSON.parse("{}"), new Date('')];
        }
    }


    /*  //////////////////////////////////////////////////////////////// */
    /*  //////////              INTERNAL METHODS              ////////// */
    /*  //////////////////////////////////////////////////////////////// */


    /*  //////////              GET METHODS              ////////// */

    // Internal action to actually perfrom a GET request
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      Request response body
    private async PerformGETRequest(endpoint: string, headers: { [key: string]: string }, timeout: number = testVars.timeoutMedium ): Promise<APIResponse> {
        console.log(`Performing a GET call on the endpoint ${endpoint}.`);
        // Capture the start time before making the API request
        const startTime = new Date();
        // Perform the API request
        const response = await this.requestContext.get(`${this.baseURL}${endpoint}`, { headers, timeout });
        // Capture the end time after the API request is completed
        const endTime = new Date();
        // Calculate the duration in milliseconds
        const duration = endTime.getTime() - startTime.getTime();
        console.log(`API call START: ${startTime.toISOString()}\nAPI call END: ${endTime.toISOString()}\nAPI call DURATION: ${duration} ms`);
        // Return the response body
        return response;
    }

    // Internal action to actually perfrom several GET requests in parallel
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      howManyParallelCalls = number
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      Request response body as array (APIResponse[])
    private async PerformSeveralGETRequestInParallel(endpoint: string, headers: { [key: string]: string }, howManyParallelCalls: number, timeout: number = testVars.timeoutMedium ): Promise<APIResponse[]> {
        console.log(`Performing ${howManyParallelCalls} parallel GET calls on the endpoint ${endpoint}.`);
        // Generate 10 identical GET requests
        const requests = Array.from({ length: howManyParallelCalls }, () => this.PerformGETRequest(endpoint, headers, timeout));
        // Send all requests in parallel and return the APIResponses
        return await Promise.all(requests);
    }

    /*  //////////              POST METHODS              ////////// */

    // Internal action to actually perfrom a POST request
    // Parameters: 
    //      url = string
    //      headers = list of key-value pair (string) elements: { "key": "value" }
    //      timeout = numeric (default value = 1000 ms)
    // Return:
    //      Request response body
    private async PerformPOSTRequest(endpoint: string, headers: { [key: string]: string }, timeout: number = testVars.timeoutLarge ): Promise<[APIResponse, Date]> {
        console.log(`Performing a POST call on the endpoint ${endpoint}.`);
        // Capture the start time before making the API request
        const startTime = new Date();
        // Perform the API request
        const response = await this.requestContext.post(`${this.baseURL}${endpoint}`, { headers, timeout });
        // Capture the end time after the API request is completed
        const endTime = new Date();
        // Calculate the duration in milliseconds
        const duration = endTime.getTime() - startTime.getTime();
        console.log(`API call START: ${startTime.toISOString()}\nAPI call END: ${endTime.toISOString()}\nAPI call DURATION: ${duration} ms`);
        // Return the response body
        return [response, endTime];
    }

}