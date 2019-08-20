export interface IBackendRuntime<Parameters> {
    parameters: Parameters;
    functions: {
        [key: string]: Function;
    };
    contextify(fnc: Function, staticContext?: any): IBackendRuntime<Parameters>;
}
export declare const createBackendRuntime: <T = any>(parameters: T) => IBackendRuntime<T>;
