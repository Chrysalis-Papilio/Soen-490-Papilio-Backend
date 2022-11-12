import { ValidationErrorItem } from 'sequelize';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { BaseError } from '../../errors/base-error';

/** Catching error */
const createNewObjectCaughtError = (error: any, methodName: string, message?: string) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        let messages = '';
        error.errors.forEach((value: ValidationErrorItem) => {
            messages = messages.concat(`${value.path} is already taken.\n`);
        });
        throw new APIError(`${messages.trim()}`, methodName, httpStatusCode.CONFLICT, true);
    } else throw new BaseError('ORM Sequelize Error', message ? message : 'There has been an error in the DB', methodName, httpStatusCode.INTERNAL_SERVER, true);
};

export { createNewObjectCaughtError };