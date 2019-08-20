import path from 'path';
import {
	IConversionOptions,
	IParseOptions,
} from 'protobufjs';

let definitionsDirectory: string | null = null;

try {
	definitionsDirectory = path.dirname(require.resolve('@gamaops/definitions'));
} catch (error) {
	try {
		definitionsDirectory = path.join(
			path.dirname(require.main!.filename),
			'../node_modules/@gamaops/definitions',
		);
	} catch (error) { }
}

export const OPERATION_FIELDS: Array<string> = [
	'createdAt',
	'createdJobId',
	'updatedAt',
	'updatedJobId',
];

export const DEFINITIONS_DIRECTORY = definitionsDirectory;
export const PROTOBUFJS_OPTIONS: IParseOptions & IConversionOptions = {
	keepCase: true,
	longs: String,
	enums: Number,
	defaults: true,
	oneofs: true,
};

export const WORKER_POOLS_SIZE = process.env.WORKER_POOLS_SIZE ? parseInt(process.env.WORKER_POOLS_SIZE) : null;
