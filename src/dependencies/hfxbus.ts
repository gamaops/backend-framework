import { ConnectionManager, Consumer, IConsumerOptions, ISentJob, Job } from 'hfxbus';
import { DataValidationError } from './grpc';
import Logger from 'bunyan';
import uuidv4 from 'uuid/v4';
import url from 'url';

export const buildConsumers = <T>(connection: ConnectionManager, options: {
	[key: string]: IConsumerOptions,
},                                consumers: {
	[key: string]: Consumer,
} = {}): T => {

	for (const key in options) {
		consumers[key] = new Consumer(connection, options[key]);
	}

	return consumers as unknown as T;

};

export const buildRedisConnection = (urisString: string): ConnectionManager => {

	const uris: Array<url.UrlWithParsedQuery> = urisString.split('|').map((uri) => url.parse(uri, true));
	
	return ConnectionManager.nodes({
		enablePipelining: true,
		nodes: uris.map((uri, index): any => {
			let { staticRoutes }: any = uri.query;
			if (typeof staticRoutes === 'string')
				staticRoutes.split(',');
			staticRoutes = (staticRoutes || []);
			if (Array.isArray(staticRoutes))
				staticRoutes = staticRoutes.map((route: string) => {
					if (/^[0-9]{1,}$/g.test(route))
						return parseInt(route);
					return route;
				});
			return {
				sequence: typeof uri.query.sequence === 'string' ? parseInt(uri.query.sequence) : index,
				staticRoutes,
				host: uri.hostname,
				port: parseInt(uri.port!)
			};
		})
	});

}

export const waitForJob = async (logger: Logger, groups: Array<string>, job: ISentJob): Promise<Job> => {

	try {
		return await job.finished();
	} catch (error) {
		const tracing = {
			jobs:[{id:job.id, groups}]
		};
		for (const group of groups) {
			if (typeof error[group] === 'object' && error[group].errno) {
				logger.warn({error, ...tracing}, `Job data validation error: ${job.id}`);
				throw new DataValidationError(
					error[group].message,
					error[group].errno,
					error[group].errid || null
				);
			}
		}
		if (!error.errid)
			error.errid = uuidv4();
		logger.error({error, ...tracing}, `Job execution error: ${job.id}`);
		throw error;
	}

}