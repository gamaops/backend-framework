export interface IBackendRuntime<Parameters> {
	parameters: Parameters;
	functions: {
		[key: string]: Function,
	};
	contextify(fnc: Function, staticContext?: any): IBackendRuntime<Parameters>;
}

export const createBackendRuntime = <T = any>(parameters: T): IBackendRuntime<T> => {

	const runtime: {
		[key: string]: any,
	} = {
		parameters,
		functions: {},
	};

	runtime.contextify = (fnc: Function, staticContext?: any) => {
		staticContext = staticContext || {};
		runtime.functions[fnc.name] = fnc.bind({...runtime, ...staticContext});
		return runtime;
	};

	return runtime as IBackendRuntime<T>;

};
