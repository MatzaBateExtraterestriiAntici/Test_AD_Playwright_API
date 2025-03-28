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
            console.log(`✅ The received object matched the expected object exactly (type and value).`);
            return true;
        }
        catch(error) {
            console.log(`Error encountered on the equal validation attempt between: '${found}' AND '${expected}' !`);
            console.error(`Error encountered on the equal validation attempt !\nError Type: ${(error as Error).name}\nError Cause: ${(error as Error).cause}\nError Summary: ${(error as Error).message}`);
            console.log(`❌ The received object did NOT match the expected object's type or value.`);
            return false;
        }
    }

    expect_date_times_have_less_than_or_max_difference(found: string, expected: Date, maxDifferenceInMilliseconds: number): boolean {
        try {
            console.log(`DateTime validation attempted between: '${found}' should be with MAX '${maxDifferenceInMilliseconds}' miliseconds difference from '${expected.toISOString()}'.`)
            const differenceInMilliseconds = Math.abs(new Date(found).getTime() - new Date(expected.toISOString()).getTime()); // Calculate the difference in milliseconds
            expect(differenceInMilliseconds).toBeLessThanOrEqual(maxDifferenceInMilliseconds); // Verify if the difference is within the expected 'maxDifference'
            console.log(`✅ The received date-time is within ${maxDifferenceInMilliseconds} miliseconds of the given date-time.`);
            return true;
        }
        catch(error) {
            console.log(`❌ The received date-time is NOT within ${maxDifferenceInMilliseconds} miliseconds of the given date-time.`);
            return false;
        }
    }

    // Overload signatures
    expect_string_matches_regex(found: string, regexExpected: RegExp): boolean;                             // Takes two parameters, returns boolean
    expect_string_matches_regex(found: string, regexExpected: RegExp, regexExplanation: string): boolean;   // Takes three parameters, returns boolean

    expect_string_matches_regex(found: string, regexExpected: RegExp, regexExplanation?: string): boolean {
        try {
            console.log(`Regular expression match validation attempted between: '${found}' and (regex) '${regexExpected}'.`)
            expect(found).toMatch(regexExpected); // Regular expression to verify the string
            console.log(`✅ The received string properly matched the given regex '${regexExpected}'!`);
            if (regexExplanation) {
                console.log(`✅ Regex eplanation:\n${regexExplanation}`);
            }
            return true;
        }
        catch(error) {
            console.log(`❌ The received string did NOT match the regex ${regexExpected} !!!`);
            return false;
        }
    }
    
}