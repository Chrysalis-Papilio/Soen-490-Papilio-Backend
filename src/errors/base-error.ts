import { httpStatusCode } from '../types/httpStatusCodes';

/** Error structure */
export class BaseError extends Error {
    public static readonly GENERIC_MESSAGE = 'Sorry, there has been an error while processing our request.';
    public readonly log: string;
    public readonly methodName!: string;
    public readonly httpCode: httpStatusCode;
    public readonly isOperational: boolean; //  Help decide what to do with error.

    constructor(log: string, message: string | unknown = log, methodName?: string, httpCode = httpStatusCode.INTERNAL_SERVER, isOperational = true) {
        super(<string>message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.log = log;
        if (methodName) this.methodName = methodName;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}
