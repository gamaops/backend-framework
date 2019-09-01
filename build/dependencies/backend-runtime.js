"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMod = __importStar(require("../logger"));
const prom_client_1 = require("prom-client");
const v4_1 = __importDefault(require("uuid/v4"));
;
var functionsExecutionTime = null;
exports.enableBackendRuntimeMetrics = () => {
    functionsExecutionTime = new prom_client_1.Histogram({
        name: 'functions_execution_time_seconds',
        help: 'Context bound functions execution time',
        labelNames: ['function', 'completionStatus']
    });
};
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
                let end = null;
                if (functionsExecutionTime)
                    end = functionsExecutionTime.startTimer({ function: fnc.name });
                try {
                    const results = rawFnc(...args);
                    if (end)
                        end({ completionStatus: 'resolved' });
                    return results;
                }
                catch (error) {
                    if (!error.errid)
                        error.errid = v4_1.default();
                    if (end)
                        end({ completionStatus: 'rejected' });
                    logger.error({ error, functionName: fnc.name }, 'Error on synchronous function');
                    throw error;
                }
            };
        }
        else if (options.logErrors === 'async') {
            const rawFnc = boundFnc;
            boundFnc = async (...args) => {
                let end = null;
                if (functionsExecutionTime)
                    end = functionsExecutionTime.startTimer({ function: fnc.name });
                return rawFnc(...args).then((results) => {
                    if (end)
                        end({ completionStatus: 'resolved' });
                    return results;
                }).catch((error) => {
                    if (!error.errid)
                        error.errid = v4_1.default();
                    if (end)
                        end({ completionStatus: 'rejected' });
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
