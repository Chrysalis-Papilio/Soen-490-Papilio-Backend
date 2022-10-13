import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../errors/base-error';
import { AnyZodObject, ZodError } from 'zod';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';

export const validate = (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (err: any) {
        var messages: String = '';
        //  Validation errors
        if (err instanceof ZodError) {
            console.log('issues: ', err.issues);
            err.issues.forEach((issue) => {
                messages = messages.concat(issue.message, '\n');
            });
            console.log(messages);
            throw new APIError(`${messages}`, '', httpStatusCode.BAD_REQUEST, true);
        }
        //  Any other errors
        throw new BaseError('Zod error.', 'Zod has had an unexpected error', '', httpStatusCode.INTERNAL_SERVER, true);
    }
};
