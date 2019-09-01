"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hfxbus_1 = require("hfxbus");
const grpc_1 = require("./grpc");
const v4_1 = __importDefault(require("uuid/v4"));
exports.buildConsumers = (connection, options, consumers = {}) => {
    for (const key in options) {
        consumers[key] = new hfxbus_1.Consumer(connection, options[key]);
    }
    return consumers;
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
