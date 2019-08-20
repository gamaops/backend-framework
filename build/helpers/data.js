"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = __importDefault(require("nanoid"));
exports.generateTimeId = (idSize = 16) => {
    return Date.now() + '-' + nanoid_1.default(idSize);
};
