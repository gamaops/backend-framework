"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hfxbus_1 = require("hfxbus");
exports.buildConsumers = (connection, options, consumers = {}) => {
    for (const key in options) {
        consumers[key] = new hfxbus_1.Consumer(connection, options[key]);
    }
    return consumers;
};
