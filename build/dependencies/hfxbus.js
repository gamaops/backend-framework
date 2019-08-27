"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hfxbus_1 = require("hfxbus");
const grpc_1 = require("./grpc");
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
        for (const group of groups) {
            if (typeof error[group] === 'object' && error[group].errno) {
                logger.warn(error, `Job execution error: ${job.id}`);
                throw new grpc_1.DataValidationError(error[group].message, error[group].errno);
            }
        }
        logger.error(error, `Job execution error: ${job.id}`);
        throw error;
    }
};
