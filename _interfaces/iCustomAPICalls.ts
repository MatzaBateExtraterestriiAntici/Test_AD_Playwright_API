// Custom Actions for API CALLS (./_framework/customAPICalls.ts)
export interface iCustomAPICalls {
    GET(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number): Promise<any>;
    GET_PARALLEL(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number, howManyParallelCalls:number, timeout: number): Promise<any>;

    POST(endpoint: string, headers: { [key: string]: string }, expectedResponseCode: number): Promise<[JSON, Date]>;
}