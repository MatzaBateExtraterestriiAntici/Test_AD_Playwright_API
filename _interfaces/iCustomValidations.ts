// Custom Actions for CUSTOM VALIDATIONS (./_framework/customValidations.ts)
export interface iCustomValidations {
    expect_are_equal<T>(found: T, expected: T): boolean;
}