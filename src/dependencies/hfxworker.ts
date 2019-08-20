import { Options } from 'generic-pool';
import { createWorkerPool, IActiveScriptPool } from 'hfxworker';
import path from 'path';
import { WORKER_POOLS_SIZE } from '../constants';

export interface IWorkerPoolOptions extends Options {
	script: string;
}

export const createWorkerPools = <T>(
	baseDirectory: string,
	options: {
		[key: string]: IWorkerPoolOptions,
	},
	pools: {
		[key: string]: IActiveScriptPool,
	} = {},
): T => {

	for (const key in options) {
		const poolOptions: IWorkerPoolOptions = options[key];
		if (WORKER_POOLS_SIZE) {
			if (!poolOptions.max) {
				poolOptions.max = WORKER_POOLS_SIZE;
			}
			if (!poolOptions.min) {
				poolOptions.min = WORKER_POOLS_SIZE;
			}
		}
		pools[key] = createWorkerPool(
			path.join(baseDirectory, options[key].script),
			poolOptions,
		);
	}

	return pools as unknown as T;
};
