import { ConnectionManager, Consumer, IConsumerOptions, ISentJob, Job } from 'hfxbus';
import Logger from 'bunyan';
export declare const buildConsumers: <T>(connection: ConnectionManager, options: {
    [key: string]: IConsumerOptions;
}, consumers?: {
    [key: string]: Consumer;
}) => T;
export declare const buildRedisConnection: (urisString: string) => ConnectionManager;
export declare const waitForJob: (logger: Logger, groups: string[], job: ISentJob) => Promise<Job>;
