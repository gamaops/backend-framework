/// <reference types="node" />
import jsonwebtoken from 'jsonwebtoken';
import { ValidateFunction, Ajv } from 'ajv';
export declare const validateJwtSchema: (token: string, validator: ValidateFunction, ajv: Ajv, secretOrPublicKey: string | Buffer, options?: jsonwebtoken.VerifyOptions) => Promise<any>;
