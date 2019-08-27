import { ConnectionManager, Consumer, IConsumerOptions, ISentJob, Job } from 'hfxbus';
import { DataValidationError } from './grpc';
import Logger from 'bunyan';

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

export const waitForJob = async (logger: Logger, groups: Array<string>, job: ISentJob): Promise<Job> => {

	try {
		return await job.finished();
	} catch (error) {
		for (const group of groups) {
			if (typeof error[group] === 'object' && error[group].errno) {
				logger.warn(error, `Job execution error: ${job.id}`);
				throw new DataValidationError(
					error[group].message,
					error[group].errno
				);
			}
		}
		logger.error(error, `Job execution error: ${job.id}`);
		throw error;
	}

}