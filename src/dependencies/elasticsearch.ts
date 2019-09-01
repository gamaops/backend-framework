import { Client, ClientOptions } from '@elastic/elasticsearch';
import { logger } from '../logger';

const esLogger = logger.child({dependency: 'elasticsearch'});

export const createElasticsearchClient = (options?: ClientOptions): Client => {
	const client = new Client(options);
	client.on('request', (error, result) => {
		const { id } = result.meta.request
		esLogger.debug({result, requestId: id }, 'Elasticsearch request');
		if (error) {
			error.errid = id;
			esLogger.error({error}, 'Elasticsearch request error');
		}
	}).on('response', (error, result) => {
		const { id } = result.meta.request
		esLogger.debug({result, requestId: id }, 'Elasticsearch response');
		if (error) {
			error.errid = id;
			esLogger.error({error}, 'Elasticsearch response error');
		}
	});
	return client;
};
