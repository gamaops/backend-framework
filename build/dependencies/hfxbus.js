"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hfxbus_1 = require("hfxbus");
const grpc_1 = require("./grpc");
const v4_1 = __importDefault(require("uuid/v4"));
const url_1 = __importDefault(require("url"));
exports.buildConsumers = (connection, options, consumers = {}) => {
    for (const key in options) {
        consumers[key] = new hfxbus_1.Consumer(connection, options[key]);
    }
    return consumers;
};
exports.buildRedisConnection = (urisString) => {
    const uris = urisString.split('|').map((uri) => url_1.default.parse(uri, true));
    return hfxbus_1.ConnectionManager.nodes({
        enablePipelining: true,
        nodes: uris.map((uri, index) => {
            let { staticRoutes } = uri.query;
            if (typeof staticRoutes === 'string')
                staticRoutes.split(',');
            staticRoutes = (staticRoutes || []);
            if (Array.isArray(staticRoutes))
                staticRoutes = staticRoutes.map((route) => {
                    if (/^[0-9]{1,}$/g.test(route))
                        return parseInt(route);
                    return route;
                });
            return {
                sequence: typeof uri.query.sequence === 'string' ? parseInt(uri.query.sequence) : index,
                staticRoutes,
                host: uri.hostname,
                port: parseInt(uri.port)
            };
        })
    });
};
exports.waitForJob = async (logger, groups, job) => {
    try {
        return await job.finished();
    }
    catch (error) {
        const tracing = {
            jobs: [{ id: job.id, groups }]
        };
        for (const group of groups) {
            if (typeof error[group] === 'object' && error[group].errno) {
                logger.warn({ error, ...tracing }, `Job data validation error: ${job.id}`);
                throw new grpc_1.DataValidationError(error[group].message, error[group].errno, error[group].errid || null);
            }
        }
        if (!error.errid)
            error.errid = v4_1.default();
        logger.error({ error, ...tracing }, `Job execution error: ${job.id}`);
        throw error;
    }
};
