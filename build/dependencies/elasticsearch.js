"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
exports.createElasticsearchClient = (options) => {
    const client = new elasticsearch_1.Client(options);
    return client;
};
