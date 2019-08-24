import jsonwebtoken, { VerifyOptions } from 'jsonwebtoken';
import { DataValidationError } from './grpc';
import { ValidateFunction, Ajv } from 'ajv';

export const validateJwtSchema = async (
	token: string,
	validator: ValidateFunction,
	ajv: Ajv,
	secretOrPublicKey: string | Buffer,
	options: VerifyOptions = {}
): Promise<any> => {
	return new Promise((resolve, reject) => {
		jsonwebtoken.verify(
			token,
			secretOrPublicKey,
			{
				...options,
				complete: true
			},
			(error, data) => {
				if (error) {
					reject(new DataValidationError(
						error.message,
						'INVALID_JWT'
					));
					return;
				}
				const isValid = validator(data);
				if (!isValid) {
					reject(new DataValidationError(
						ajv.errorsText(validator.errors),
						'INVALID_JWT'
					));
					return;
				}
				resolve(data);
			}
		);
	});
}