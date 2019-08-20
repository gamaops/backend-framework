/// <reference types="node" />
import { Root, Type } from 'protobufjs';
export declare const loadProtosDefinitions: (definitions: string[], protos?: Root | undefined) => Root;
export declare const parseProtobufToObject: <T>(buffer: Uint8Array | Buffer, type: Type) => T;
export declare const parseObjectToProtobuf: <T = any>(object: T, type: Type) => Buffer;
