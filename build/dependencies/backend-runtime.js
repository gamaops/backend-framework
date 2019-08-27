"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMod = __importStar(require("../logger"));
;
exports.createBackendRuntime = (parameters) => {
    const runtime = {
        parameters,
        functions: {},
    };
    runtime.contextify = (fnc, staticContext, options = {}) => {
        staticContext = staticContext || {};
        let boundFnc = fnc.bind({ ...runtime, ...staticContext });
        const logger = staticContext.logger || loggerMod.logger;
        if (options.logErrors === 'sync') {
            const rawFnc = boundFnc;
            boundFnc = (...args) => {
                try {
                    return rawFnc(...args);
                }
                catch (error) {
                    logger.error({ error, functionName: fnc.name }, 'Error on synchronous function');
                    throw error;
                }
            };
        }
        else if (options.logErrors === 'async') {
            const rawFnc = boundFnc;
            boundFnc = async (...args) => {
                return rawFnc(...args).catch((error) => {
                    logger.error({ error, functionName: fnc.name }, 'Error on asynchronous function');
                    return Promise.reject(error);
                });
            };
        }
        runtime.functions[fnc.name] = boundFnc;
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
