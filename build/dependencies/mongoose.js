"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const v4_1 = __importDefault(require("uuid/v4"));
const mongoLogger = logger_1.logger.child({ dependency: 'mongodb' });
exports.connectMongoose = async (mongodbUri, mongoose) => {
    mongoose.connect(mongodbUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoReconnect: true,
        useFindAndModify: false,
    });
    mongoose.connection.on('error', (error) => {
        if (!error.errid)
            error.errid = v4_1.default();
        mongoLogger.fatal({ error });
        process.exit(1);
    });
    return new Promise((resolve) => {
        mongoose.connection.once('connected', () => {
            resolve();
        });
    });
};
