import { IEventStashClientOptions, IPackageClient } from 'hfxeventstash/build/types/client';
import { IStoreEventRequest } from 'hfxeventstash/build/types/interfaces/eventstash';
export declare const wrapStoreEvent: (eventStore: IPackageClient) => (event: IStoreEventRequest) => void;
export interface IEventStashClient extends IPackageClient {
    storeEvent(event: IStoreEventRequest): void;
}
export declare const connectEventStash: (options: IEventStashClientOptions) => IEventStashClient;
