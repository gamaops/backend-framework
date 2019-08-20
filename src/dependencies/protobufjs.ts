import path from 'path';
import { Root } from 'protobufjs';
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
