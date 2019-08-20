import path from 'path';
import { Root, Type } from 'protobufjs';
import {
	DEFINITIONS_DIRECTORY,
	PROTOBUFJS_OPTIONS,
} from '../constants';

export const loadProtosDefinitions = (
	definitions: Array<string>,
	protos?: Root,
): Root => {

	if (!protos) {
		protos = new Root();
	}

	protos.loadSync(
		definitions.map((file) => path.join(DEFINITIONS_DIRECTORY!, file)),
		PROTOBUFJS_OPTIONS,
	);

	return protos;

};

export const parseProtobufToObject = <T>(
	buffer: Buffer | Uint8Array,
	type: Type
): T => {
	return type.toObject(
		type.decode(buffer),
		PROTOBUFJS_OPTIONS
	) as T;
};

export const parseObjectToProtobuf = <T = any>(
	object: T,
	type: Type
): Buffer => {
	return Buffer.from(
		type.encode(
			object
		).finish()
	);
};