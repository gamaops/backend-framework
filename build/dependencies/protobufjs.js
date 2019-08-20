"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const protobufjs_1 = require("protobufjs");
const constants_1 = require("../constants");
exports.loadProtosDefinitions = (definitions, protos) => {
    if (!protos) {
        protos = new protobufjs_1.Root();
    }
    protos.loadSync(definitions.map((file) => path_1.default.join(constants_1.DEFINITIONS_DIRECTORY, file)), constants_1.PROTOBUFJS_OPTIONS);
    return protos;
};
