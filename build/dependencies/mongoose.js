"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
exports.connectMongoose = async (mongodbUri, mongoose) => {
    mongoose.connect(mongodbUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoReconnect: true,
        useFindAndModify: false,
    });
    mongoose.connection.on('error', (error) => {
        logger_1.logger.fatal(error);
        process.exit(1);
    });
    return new Promise((resolve) => {
        mongoose.connection.once('connected', () => {
            resolve();
        });
    });
};
