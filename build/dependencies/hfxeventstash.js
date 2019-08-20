"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hfxeventstash_1 = __importDefault(require("hfxeventstash"));
const logger_1 = require("../logger");
exports.wrapStoreEvent = (eventStore) => {
    let previousError = false;
    let call = null;
    return (event) => {
        if (call === null) {
            call = eventStore.eventStash.storeEvent((error, response) => {
                call = null;
                if (error) {
                    if (previousError) {
                        logger_1.logger.fatal(error, 'Could not reconnect to event store');
                        return;
                    }
                    previousError = true;
                    logger_1.logger.warn(error, 'Event store call error');
                    return;
                }
                previousError = false;
                logger_1.logger.info(response, 'Event store response');
            });
        }
        call.write(event);
    };
};
exports.connectEventStash = (options) => {
    const eventstore = hfxeventstash_1.default(options);
    eventstore.storeEvent = exports.wrapStoreEvent(eventstore);
    return eventstore;
};
