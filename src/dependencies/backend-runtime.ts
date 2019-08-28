import * as loggerMod from '../logger';
import {
	Histogram
} from 'prom-client';

export interface IContextifyOptions {
	logErrors?: 'sync' | 'async'
};

export interface IBackendRuntime<Parameters, Functions> {
	parameters: Parameters;
	functions: Functions;
	contextify(fnc: Function, staticContext?: any, options?: IContextifyOptions): IBackendRuntime<Parameters, Functions>;
	fncs(): Functions;
	params(): Parameters;
}

var functionsExecutionTime: null | Histogram = null;

export const enableBackendRuntimeMetrics = () => {
	functionsExecutionTime = new Histogram({
		name: 'functions_execution_time_seconds',
		help: 'Context bound functions execution time',
		labelNames: ['function', 'completionStatus']
	});
}

export const createBackendRuntime = <
	Parameters = any,
	Functions = any
>(parameters: Parameters): IBackendRuntime<Parameters, Functions> => {

	const runtime: {
		[key: string]: any,
	} = {
		parameters,
		functions: {},
	};

	runtime.contextify = (fnc: Function, staticContext?: any, options: IContextifyOptions = {}) => {
		staticContext = staticContext || {};
		let boundFnc = fnc.bind({...runtime, ...staticContext});
		const logger = staticContext.logger || loggerMod.logger;
		if (options.logErrors === 'sync') {
			const rawFnc = boundFnc;
			boundFnc = (...args: Array<any>): any => {
				let end = null;
				if (functionsExecutionTime)
					end = functionsExecutionTime.startTimer({ function: fnc.name });
				try {
					const results = rawFnc(...args);
					if (end)
						end({ completionStatus: 'resolved' });
					return results;
				} catch (error) {
					if (end)
						end({ completionStatus: 'rejected' });
					logger.error({error, functionName: fnc.name}, 'Error on synchronous function');
					throw error;
				}
			}
		}
		else if (options.logErrors === 'async') {
			const rawFnc = boundFnc;
			boundFnc = async (...args: Array<any>): Promise<any> => {
				let end: any = null;
				if (functionsExecutionTime)
					end = functionsExecutionTime.startTimer({ function: fnc.name });
				return rawFnc(...args).then((results: any) => {
					if (end)
						end({ completionStatus: 'resolved' });
					return results;
				}).catch((error: any) => {
					if (end)
						end({ completionStatus: 'rejected' });
					logger.error({error, functionName: fnc.name}, 'Error on asynchronous function');
					return Promise.reject(error);
				});
			}
		}
		runtime.functions[fnc.name] = boundFnc;
		return runtime;
	};

	runtime.fncs = (): Functions => {
		return runtime.functions as Functions;
	};

	runtime.params = (): Parameters => {
		return runtime.parameters as Parameters;
	};

	return runtime as IBackendRuntime<Parameters, Functions>;

};
