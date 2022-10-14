import { logger } from '../config/logger';
import { BaseError } from './base-error';
import { Request, Response, NextFunction } from 'express';
import { APIError } from './api-error';

export class ErrorHandler {
    /** How to handle the error i.e. exit, email... */
    public async handleError(err: BaseError, _: Request, res: Response, __: NextFunction) {
        logger.error(`Error message from the centralized error-handling component: {
             LOG: \"${err.log}\" 
             MESSAGE: \"${err.message}\" 
             METHOD: \"${err.methodName}\" 
             HTTP CODE: \"${err.httpCode}\" 
             IS_OPERATIONAL: \"${err.isOperational}\" 
            }`);

        /** Sending response back to client. */
        const message = err instanceof APIError ? err.message : BaseError.GENERIC_MESSAGE;
        res.status((<BaseError>err).httpCode || 500).send(message);
        //  await sendMailToAdminIfCritical();
        //  await sendEventsToSentry();
    }

    public returnError(err: BaseError, _: Request, res: Response, __: NextFunction) {
        logger.debug('Returning error.');
        const message = err instanceof APIError ? err.message : BaseError.GENERIC_MESSAGE;
        res.status((<BaseError>err).httpCode || 500).send(message);
    }

    /** Make sure the error was intentionally invoked (known error) */
    public isTrustedError(error: Error) {
        return error instanceof BaseError && error.isOperational;
    }
}
