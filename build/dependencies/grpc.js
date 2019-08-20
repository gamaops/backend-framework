"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protoLoader = __importStar(require("@grpc/proto-loader"));
const grpc_1 = __importDefault(require("grpc"));
const path_1 = __importDefault(require("path"));
const v4_1 = __importDefault(require("uuid/v4"));
const constants_1 = require("../constants");
exports.getGrpcProtoDescriptor = (files) => {
    const packageDefinition = protoLoader.loadSync(files.map((file) => path_1.default.join(constants_1.DEFINITIONS_DIRECTORY, file)), constants_1.PROTOBUFJS_OPTIONS);
    return grpc_1.default.loadPackageDefinition(packageDefinition);
};
class DataValidationError extends Error {
    constructor(message, errno) {
        super(message);
        this.errno = 'INTERNAL_ERROR';
        if (errno)
            this.errno = errno;
    }
}
exports.DataValidationError = DataValidationError;
exports.handleSchemaValidationError = (logger, schemaValidator, error) => {
    if (Array.isArray(error)) {
        logger.debug(error, 'Validation errors');
        const metadata = new grpc_1.default.Metadata();
        metadata.set('errno', 'INVALID_SCHEMA');
        const statusError = {
            name: 'schema validation error',
            message: schemaValidator.errorsText(error),
            metadata,
            code: grpc_1.default.status.INVALID_ARGUMENT,
        };
        return statusError;
    }
    return null;
};
exports.handleDataValidationError = (logger, error) => {
    if (error instanceof DataValidationError) {
        logger.debug(error, 'Validation errors');
        const metadata = new grpc_1.default.Metadata();
        metadata.set('errno', error.errno);
        const statusError = {
            name: 'schema validation error',
            message: error.message,
            metadata,
            code: grpc_1.default.status.INVALID_ARGUMENT,
        };
        return statusError;
    }
    return null;
};
exports.handleInternalError = (logger, error) => {
    error.id = v4_1.default();
    let errno = 'INTERNAL_ERROR';
    if (Reflect.has(error, 'errno'))
        errno = error.errno;
    logger.error(error, 'Internal error');
    const metadata = new grpc_1.default.Metadata();
    metadata.set('errno', errno);
    metadata.set('errid', error.id);
    const statusError = {
        name: 'internal error',
        message: error.id,
        metadata,
        code: grpc_1.default.status.INTERNAL,
    };
    return statusError;
};
exports.wrapGrpcUnaryMethod = ({ schemaValidator, logger, }, method) => {
    return (call, callback) => method(call)
        .then((response) => callback(null, response))
        .catch((error) => {
        let serviceError = null;
        if (schemaValidator) {
            serviceError = exports.handleSchemaValidationError(logger, schemaValidator, error);
        }
        if (serviceError) {
            callback(serviceError, null);
            return;
        }
        serviceError = exports.handleDataValidationError(logger, error);
        if (serviceError) {
            callback(serviceError, null);
            return;
        }
        serviceError = exports.handleInternalError(logger, error);
        callback(serviceError, null);
    });
};
