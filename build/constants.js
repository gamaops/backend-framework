"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
let definitionsDirectory = null;
try {
    definitionsDirectory = path_1.default.dirname(require.resolve('@gamaops/definitions'));
}
catch (error) {
    try {
        definitionsDirectory = path_1.default.join(path_1.default.dirname(require.main.filename), '../node_modules/@gamaops/definitions');
    }
    catch (error) { }
}
exports.OPERATION_FIELDS = [
    'createdAt',
    'createdJobId',
    'updatedAt',
    'updatedJobId',
];
exports.DEFINITIONS_DIRECTORY = definitionsDirectory;
exports.PROTOBUFJS_OPTIONS = {
    keepCase: true,
    longs: String,
    enums: Number,
    defaults: true,
    oneofs: true,
};
exports.WORKER_POOLS_SIZE = process.env.WORKER_POOLS_SIZE ? parseInt(process.env.WORKER_POOLS_SIZE) : null;
