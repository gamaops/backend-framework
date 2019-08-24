"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const grpc_1 = require("./grpc");
exports.validateJwtSchema = async (token, validator, ajv, secretOrPublicKey, options = {}) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretOrPublicKey, {
            ...options,
            complete: true
        }, (error, data) => {
            if (error) {
                reject(new grpc_1.DataValidationError(error.message, 'INVALID_JWT'));
                return;
            }
            const isValid = validator(data);
            if (!isValid) {
                reject(new grpc_1.DataValidationError(ajv.errorsText(validator.errors), 'INVALID_JWT'));
                return;
            }
            resolve(data);
        });
    });
};
