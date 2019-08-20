import * as protoLoader from '@grpc/proto-loader';
import Ajv from 'ajv';
import Logger from 'bunyan';
import grpc, {
	sendUnaryData,
	ServerUnaryCall,
	ServiceError,
} from 'grpc';
import path from 'path';
import uuidv4 from 'uuid/v4';
import {
	DEFINITIONS_DIRECTORY,
	PROTOBUFJS_OPTIONS,
} from '../constants';

export const getGrpcProtoDescriptor = <T>(files: Array<string>): T => {
	const packageDefinition = protoLoader.loadSync(
		files.map((file) => path.join(DEFINITIONS_DIRECTORY!, file)),
		PROTOBUFJS_OPTIONS,
	);
	return grpc.loadPackageDefinition(packageDefinition) as unknown as T;
};

export class DataValidationError<T = string> extends Error {

	public errno: T | 'INTERNAL_ERROR' = 'INTERNAL_ERROR';

	constructor(message: string, errno?: T) {
		super(message);
		if (errno)
			this.errno = errno;
	}

}

export const handleSchemaValidationError = (logger: Logger, schemaValidator: Ajv.Ajv, error: any): ServiceError | null => {
	if (Array.isArray(error)) {
		logger.debug(error, 'Validation errors');
		const metadata = new grpc.Metadata();
		metadata.set('errno', 'INVALID_SCHEMA');
		const statusError: ServiceError = {
			name: 'schema validation error',
			message: schemaValidator.errorsText(error),
			metadata,
			code: grpc.status.INVALID_ARGUMENT,
		};
		return statusError;
	}
	return null;
};

export const handleDataValidationError = (logger: Logger, error: any): ServiceError | null => {
	if (error instanceof DataValidationError) {
		logger.debug(error, 'Validation errors');
		const metadata = new grpc.Metadata();
		metadata.set('errno', error.errno);
		const statusError: ServiceError = {
			name: 'schema validation error',
			message: error.message,
			metadata,
			code: grpc.status.INVALID_ARGUMENT,
		};
		return statusError;
	}
	return null;
};

export const handleInternalError = (logger: Logger, error: any): ServiceError => {
	error.id = uuidv4();
	let errno: any = 'INTERNAL_ERROR';
	if (Reflect.has(error, 'errno'))
		errno = error.errno;
	logger.error(error, 'Internal error');
	const metadata = new grpc.Metadata();
	metadata.set('errno', errno);
	metadata.set('errid', error.id);
	const statusError: ServiceError = {
		name: 'internal error',
		message: error.id,
		metadata,
		code: grpc.status.INTERNAL,
	};
	return statusError;
};

export type IGrpcAsyncUnaryMethod<RequestType, ResponseType> = (call: ServerUnaryCall<RequestType>) => Promise<ResponseType>;

export const wrapGrpcUnaryMethod = <RequestType, ResponseType>(
	{
		schemaValidator,
		logger,
	}: {
		schemaValidator?: Ajv.Ajv,
		logger: Logger,
	},
	method: IGrpcAsyncUnaryMethod<RequestType, ResponseType>,
): (
	call: ServerUnaryCall<RequestType>,
	callback: sendUnaryData<ResponseType>,
) => void => {
	return (call, callback) => method(call)
		.then((response) => callback(null, response))
		.catch((error) => {
			let serviceError: ServiceError | null = null;
			if (schemaValidator) {
				serviceError = handleSchemaValidationError(
					logger,
					schemaValidator,
					error,
				);
			}
			if (serviceError) {
				callback(serviceError, null);
				return;
			}
			serviceError = handleDataValidationError(
				logger,
				error,
			);
			if (serviceError) {
				callback(serviceError, null);
				return;
			}
			serviceError = handleInternalError(
				logger,
				error,
			);
			callback(serviceError, null);
		});
};
