import Ajv, { Options } from 'ajv';
import glob from 'glob';
import path from 'path';

import {
	DEFINITIONS_DIRECTORY,
} from '../constants';

export const getJsonSchemaValidator = (options?: Options): Ajv.Ajv => {
	const ajv = new Ajv(options);

	const schemas = glob.sync(
		path.join(DEFINITIONS_DIRECTORY!, '*/schemas/**/*.json'),
		{
			nodir: true,
			ignore: [
				'node_modules/**/*',
			],
		},
	).map((file) => require(file));

	ajv.addSchema(schemas);

	return ajv;
};
