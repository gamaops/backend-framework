import Ajv from 'ajv';
import Logger from 'bunyan';
import grpc, { ServerUnaryCall } from 'grpc';
export declare const getGrpcProtoDescriptor: <T>(files: string[]) => T;
export declare class DataValidationError<T = string> extends Error {
    errno: T | 'INTERNAL_ERROR';
    errid: string | null;
    constructor(message: string, errno?: T, errid?: string);
}
export declare const handleSchemaValidationError: (logger: Logger, schemaValidator: Ajv.Ajv, error: any) => grpc.ServiceError | null;
export declare const handleDataValidationError: (logger: Logger, error: any) => grpc.ServiceError | null;
export declare const handleInternalError: (logger: Logger, error: any) => grpc.ServiceError;
export declare type IGrpcAsyncUnaryMethod<RequestType, ResponseType> = (call: ServerUnaryCall<RequestType>) => Promise<ResponseType>;
export declare const wrapGrpcUnaryMethod: <RequestType, ResponseType_1>({ schemaValidator, logger, }: {
    schemaValidator?: Ajv.Ajv | undefined;
    logger: Logger;
}, method: IGrpcAsyncUnaryMethod<RequestType, ResponseType_1>) => (call: grpc.ServerUnaryCall<RequestType>, callback: grpc.sendUnaryData<ResponseType_1>) => void;
