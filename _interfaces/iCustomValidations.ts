// Custom Actions for CUSTOM VALIDATIONS (./_framework/customValidations.ts)
export interface iCustomValidations {
    expect_are_equal<T>(found: T, expected: T): boolean;
    expect_date_times_have_less_than_or_max_difference(found: string, expected: Date, maxDifferenceInMilliseconds: number): boolean;
    expect_string_matches_regex(found: string, regexExpected: RegExp): boolean;
    expect_string_matches_regex(found: string, regexExpected: RegExp, regexExplanation: string): boolean;
}