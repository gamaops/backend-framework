export interface IBackendRuntime<Parameters, Functions> {
	parameters: Parameters;
	functions: {
		[key: string]: Function,
	};
	contextify(fnc: Function, staticContext?: any): IBackendRuntime<Parameters, Functions>;
	fncs(): Functions;
	params(): Parameters;
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

	runtime.contextify = (fnc: Function, staticContext?: any) => {
		staticContext = staticContext || {};
		runtime.functions[fnc.name] = fnc.bind({...runtime, ...staticContext});
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
