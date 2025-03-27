// Custom Actions for API CALLS (./_framework/customAPICalls.ts)
export interface iMainFeaturesMethods {
    VerifyMainFeaturesForGet(expectedStatus: number): Promise<void>;
    VerifyMainFeaturesForGetInParallel(expectedStatus: number, howManyParallelCalls: number): Promise<void>;
}