"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const logger_1 = require("../logger");
const esLogger = logger_1.logger.child({ dependency: 'elasticsearch' });
exports.createElasticsearchClient = (options) => {
    const client = new elasticsearch_1.Client(options);
    client.on('request', (error, result) => {
        const { id } = result.meta.request;
        esLogger.debug({ result, requestId: id }, 'Elasticsearch request');
        if (error) {
            error.errid = id;
            esLogger.error({ error }, 'Elasticsearch request error');
        }
    }).on('response', (error, result) => {
        const { id } = result.meta.request;
        esLogger.debug({ result, requestId: id }, 'Elasticsearch response');
        if (error) {
            error.errid = id;
            esLogger.error({ error }, 'Elasticsearch response error');
        }
    });
    return client;
};
