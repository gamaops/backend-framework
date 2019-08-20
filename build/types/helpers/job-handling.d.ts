import { Job } from 'hfxbus';
export declare enum JobOperation {
    CREATE = 0,
    UPDATE = 1
}
export declare const getJobOperationDate: (job: Job, operation: JobOperation) => {
    updatedAt?: Date | undefined;
    updatedJobId?: string | undefined;
    createdAt?: Date | undefined;
    createdJobId?: string | undefined;
};
