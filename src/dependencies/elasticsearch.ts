import { Client, ClientOptions } from '@elastic/elasticsearch';
import { logger } from '../logger';

export const createElasticsearchClient = (options?: ClientOptions): Client => {
	const client = new Client(options);
	client.on('request', (error, result) => {
		const { id } = result.meta.request
		logger.debug({result, requestId: id }, 'Elasticsearch request');
		if (error)
			logger.error({error, requestId: id }, 'Elasticsearch request error');
	}).on('response', (error, result) => {
		const { id } = result.meta.request
		logger.debug({result, requestId: id }, 'Elasticsearch response');
		if (error)
			logger.error({error, requestId: id }, 'Elasticsearch response error');
	});
	return client;
};
