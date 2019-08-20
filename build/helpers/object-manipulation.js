"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyKeys = (object, emptyValue = '') => {
    const stack = [object];
    while (stack.length > 0) {
        const cursor = stack.pop();
        if (Array.isArray(cursor)) {
            for (const item of cursor) {
                if (Array.isArray(item) || typeof item === 'object') {
                    stack.push(item);
                }
            }
            continue;
        }
        for (const key in cursor) {
            if (cursor[key] === emptyValue) {
                delete cursor[key];
            }
            if (Array.isArray(cursor[key]) || typeof cursor[key] === 'object') {
                stack.push(cursor[key]);
            }
        }
    }
    return object;
};
exports.removeKeysIfPresent = (object, ...keys) => {
    for (const key of keys) {
        if (Reflect.has(object, key)) {
            Reflect.deleteProperty(object, key);
        }
    }
    return object;
};
