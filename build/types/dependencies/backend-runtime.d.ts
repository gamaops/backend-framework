export interface IContextifyOptions {
    logErrors?: 'sync' | 'async';
}
export interface IBackendRuntime<Parameters, Functions> {
    parameters: Parameters;
    functions: Functions;
    contextify(fnc: Function, staticContext?: any, options?: IContextifyOptions): IBackendRuntime<Parameters, Functions>;
    fncs(): Functions;
    params(): Parameters;
}
export declare const createBackendRuntime: <Parameters_1 = any, Functions = any>(parameters: Parameters_1) => IBackendRuntime<Parameters_1, Functions>;
