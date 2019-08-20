import { Job } from 'hfxbus';

export enum JobOperation {
	CREATE = 0,
	UPDATE = 1,
}

export const getJobOperationDate = (job: Job, operation: JobOperation): {
	updatedAt?: Date;
	updatedJobId?: string;
	createdAt?: Date;
	createdJobId?: string;
} => {
	if (operation === JobOperation.CREATE) {
		return {
			createdAt: new Date(),
			createdJobId: job.id,
		};
	} else if (operation === JobOperation.UPDATE) {
		return {
			updatedAt: new Date(),
			updatedJobId: job.id,
		};
	}
	throw new Error(`Unknown job operation: ${operation} (job id: ${job.id})`);
};
