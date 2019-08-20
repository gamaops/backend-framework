import { Options } from 'generic-pool';
import { IActiveScriptPool } from 'hfxworker';
export interface IWorkerPoolOptions extends Options {
    script: string;
}
export declare const createWorkerPools: <T>(baseDirectory: string, options: {
    [key: string]: IWorkerPoolOptions;
}, pools?: {
    [key: string]: IActiveScriptPool;
}) => T;
