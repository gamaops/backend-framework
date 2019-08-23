"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackendRuntime = (parameters) => {
    const runtime = {
        parameters,
        functions: {},
    };
    runtime.contextify = (fnc, staticContext) => {
        staticContext = staticContext || {};
        runtime.functions[fnc.name] = fnc.bind({ ...runtime, ...staticContext });
        return runtime;
    };
    runtime.fncs = () => {
        return runtime.functions;
    };
    runtime.params = () => {
        return runtime.parameters;
    };
    return runtime;
};
