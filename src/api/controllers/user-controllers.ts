import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
        /**  Call to service layer */
        const result = await userService.getAllUsers();

        /**  Return a response to client. */
        res.send(result);
    } catch (err) {
        next(err);
    }
};

const createSampleUser = async (_: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const result = await userService.createSampleUser();

        /** Return a response to client. */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createSimpleUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    try {
        // Call service layer
        const result = await userService.createSimpleUser(user);

        // Return result
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    try {
        // Check request body
        if (!email) throw new APIError('Missing Email.', 'getUserByEmail', httpStatusCode.BAD_REQUEST, true);
        // Regex match for email
        if (!email.match(emailRegex)) throw new APIError('Where is the email, Lebowski?', 'getUserByEmail', httpStatusCode.BAD_REQUEST, true);
        // Call service layer
        const result = await userService.getUserByEmail(email);
        // Return result
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const fields: string[] = req.body.fields;
    const user = req.body.user;
    try {
        // Check request body
        if (fields.length === 0) throw new APIError('Missing fields.', 'updateUserProfile', httpStatusCode.BAD_REQUEST, true);
        fields.forEach((f: string) => {
            if (!['firstName', 'lastName', 'firebase_id', 'email'].includes(f)) throw new APIError(`${f} cannot be used in fields.`, 'updateUserProfile', httpStatusCode.BAD_REQUEST, true);
        });
        ['id'].forEach((f: string) => {
            if (user[f]) throw new APIError(`Cannot update ${f} field.`, 'updateUserProfile', httpStatusCode.BAD_REQUEST, true);
        });
        // Call service layer
        const result = await userService.updateUserProfile(fields, user);

        // Return result
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
