import { Request, Response } from 'express';
import { userService } from '../services';
import { logging } from '../../config';

const NAMESPACE: string = 'controllers/userController';
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const getAllUsers = async (_: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Controlling all users from Postgres Database`);
    try {
        // Call to service layer
        const result = await userService.getAllUsers();

        // Return a response to client.
        return res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        logging.error(err.message);

        // Return a response to client.
        return res.status(500).json({
            error: error
        });
    }
};

const createSampleUser = async (_: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Creating a sample user`);
    try {
        // Call to service layer
        const result = await userService.createSampleUser();

        // Return a response to client.
        return res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        logging.error(err.message);

        // Return a response to client.
        return res.status(500).json({
            error: error
        });
    }
};

const createSimpleUser = async (req: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Creating a simple user with request body`);
    const user = req.body;
    try {
        // Check for required request body
        if (!user.firstName) throw new MissingAttributeError('fileName', 'createSimpleUser');
        if (!user.lastName) throw new MissingAttributeError('lastName', 'createSimpleUser');
        if (!user.email) throw new MissingAttributeError('email', 'createSimpleUser');

        // Call service layer
        const result = await userService.createSimpleUser(user);

        // Return result
        return res.status(200).json(result);
    } catch (e) {
        // Return error caught during check or service layer call
        if (e instanceof Error) {
            logging.error(e.message);
            return res.status(400).json({ error: e });
        }
        return res.status(500).json({ error: e });
    }
};

const getUserByEmail = async (req: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Getting the User with matching email`);
    const email = req.body.email;
    try {
        // Check request body
        if (!email) throw new MissingAttributeError('email', 'getUserByEmail');

        // Regex match for email
        if (!email.match(emailRegex)) throw new TypeError('Not an email input.');

        // Call service layer
        const result = await userService.getUserByEmail(email);

        // Return result
        return res.status(200).json(result);
    } catch (e) {
        // Return error caught during check or user-service call
        if (e instanceof MissingAttributeError) {
            logging.error('Where is the email, Lebowski?');
            return res.status(400).json({ error: e });
        }
        if (e instanceof TypeError) {
            logging.error(e.message);
            return res.status(400).json({ error: { message: e.message } });
        }
        return res.status(500).json({ error: e });
    }
};

const updateUserProfile = async (req: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Updating the User profile`);
    const fields: string[] = req.body.fields;
    const user = req.body.user;
    try {
        // Check request body
        if (fields.length === 0) throw new MissingAttributeError('fields', 'updateUserProfile');
        fields.forEach((f: string) => {
            if (!['firstName', 'lastName', 'firebase_id', 'email'].includes(f)) throw new TypeError(`${f} cannot be used in fields.`);
        });
        ['id'].forEach((f: string) => {
            if (user[f]) throw new TypeError(`Cannot update ${f} field.`);
        });

        // Call service layer
        const result = await userService.updateUserProfile(fields, user);

        // Return result
        return res.status(200).json(result);
    } catch (e) {
        if (e instanceof TypeError) return res.status(400).json({ error: { message: e.message } });
        if (e instanceof Error) return res.status(400).json({ error: e });
        return res.status(500).json({ error: e });
    }
};

class MissingAttributeError extends Error {
    declare controller: String;

    constructor(att: String, controller: String) {
        super();
        this.message = `Missing ${att} in request input.`;
        this.controller = controller;
    }
}

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
