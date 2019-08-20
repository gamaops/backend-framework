import { ConnectionManager, Consumer, IConsumerOptions } from 'hfxbus';

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
