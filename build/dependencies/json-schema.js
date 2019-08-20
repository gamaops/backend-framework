"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
exports.getJsonSchemaValidator = (options) => {
    const ajv = new ajv_1.default(options);
    const schemas = glob_1.default.sync(path_1.default.join(constants_1.DEFINITIONS_DIRECTORY, '*/schemas/**/*.json'), {
        nodir: true,
        ignore: [
            'node_modules/**/*',
        ],
    }).map((file) => require(file));
    ajv.addSchema(schemas);
    return ajv;
};
