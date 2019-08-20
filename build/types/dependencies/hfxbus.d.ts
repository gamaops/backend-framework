import { ConnectionManager, Consumer, IConsumerOptions } from 'hfxbus';
export declare const buildConsumers: <T>(connection: ConnectionManager, options: {
    [key: string]: IConsumerOptions;
}, consumers?: {
    [key: string]: Consumer;
}) => T;
