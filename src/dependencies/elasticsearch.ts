import { Client, ClientOptions } from '@elastic/elasticsearch';

export const createElasticsearchClient = (options?: ClientOptions): Client => {
	const client = new Client(options);
	return client;
};
