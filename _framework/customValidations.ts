import { expect } from '@playwright/test';
import { iCustomValidations } from '../_interfaces/iCustomValidations.js';

export class CustomValidations implements iCustomValidations {
    
    // Custom action to validate that two elements are equal
    // Parameters: 
    //      foundValue = string
    //      expectedValue = string
    // Return:
    //      boolean (with the result)
    expect_are_equal<T>(found: T, expected: T): boolean {
        try {
            console.log(`Equal validation attempted between: '${found}' (of type '${typeof found}') AND '${expected}' (of type '${typeof expected}').`)
            expect(found).toBe(expected);
            return true;
        }
        catch(error) {
            console.log(`Error encountered on the equal validation attempt between: '${found}' AND '${expected}' !`);
            console.error(`Error encountered on the equal validation attempt !\nError Type: ${(error as Error).name}\nError Cause: ${(error as Error).cause}\nError Summary: ${(error as Error).message}`);
            return false;
        }
    }
}