import {
	ClientWritableStream,
} from 'grpc';
import makeEventStore from 'hfxeventstash';
import {
	IEventStashClientOptions,
	IPackageClient,
} from 'hfxeventstash/build/types/client';
import {
	IStoreEventRequest,
} from 'hfxeventstash/build/types/interfaces/eventstash';
import {
	logger,
} from '../logger';

export const wrapStoreEvent = (eventStore: IPackageClient) => {
	let previousError: boolean = false;
	let call: ClientWritableStream<IStoreEventRequest> | null = null;
	return (event: IStoreEventRequest) => {
		if (call === null) {
			call = eventStore.eventStash.storeEvent((error, response) => {
				call = null;
				if (error) {
					if (previousError) {
						logger.fatal(error, 'Could not reconnect to event store');
						// TODO: Handle error
						return;
					}
					previousError = true;
					logger.warn(error, 'Event store call error');
					return;
				}
				previousError = false;
				logger.info(response, 'Event store response');
			});
		}
		call.write(event);
	};
};

export interface IEventStashClient extends IPackageClient {
	storeEvent(event: IStoreEventRequest): void;
}

export const connectEventStash = (options: IEventStashClientOptions): IEventStashClient => {

	const eventstore: any = makeEventStore(options);

	eventstore.storeEvent = wrapStoreEvent(eventstore);

	return eventstore;

};
