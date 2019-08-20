"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hfxworker_1 = require("hfxworker");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
exports.createWorkerPools = (baseDirectory, options, pools = {}) => {
    for (const key in options) {
        const poolOptions = options[key];
        if (constants_1.WORKER_POOLS_SIZE) {
            if (!poolOptions.max) {
                poolOptions.max = constants_1.WORKER_POOLS_SIZE;
            }
            if (!poolOptions.min) {
                poolOptions.min = constants_1.WORKER_POOLS_SIZE;
            }
        }
        pools[key] = hfxworker_1.createWorkerPool(path_1.default.join(baseDirectory, options[key].script), poolOptions);
    }
    return pools;
};
