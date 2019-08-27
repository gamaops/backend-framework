"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const logger_1 = require("../logger");
exports.createElasticsearchClient = (options) => {
    const client = new elasticsearch_1.Client(options);
    client.on('request', (error, result) => {
        const { id } = result.meta.request;
        logger_1.logger.debug({ result, requestId: id }, 'Elasticsearch request');
        if (error)
            logger_1.logger.error({ error, requestId: id }, 'Elasticsearch request error');
    }).on('response', (error, result) => {
        const { id } = result.meta.request;
        logger_1.logger.debug({ result, requestId: id }, 'Elasticsearch response');
        if (error)
            logger_1.logger.error({ error, requestId: id }, 'Elasticsearch response error');
    });
    return client;
};
