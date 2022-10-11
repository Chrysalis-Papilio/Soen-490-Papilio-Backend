import { httpStatusCode } from '../types/httpStatusCodes';
import { BaseError } from './base-error';

export class APIError extends BaseError {
    constructor(message: string, methodName = '', httpCode = httpStatusCode.INTERNAL_SERVER, isOperational = true) {
        super('', message, methodName, httpCode, isOperational);
    }
}
