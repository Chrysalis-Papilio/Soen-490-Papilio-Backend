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
        if (!user.firstName) throw new TypeError('Missing attribute error');
        if (!user.lastName) throw new TypeError('Missing lastName for user');
        if (!user.email) throw new TypeError('Missing email for user');

        // Call service layer
        const result = await userService.createSimpleUser(user);

        // Return result
        return res.status(200).json(result);
    } catch (error) {
        // Return error caught during check or service layer call
        const err = error as Error;
        logging.error(err.message);
        return res.status(500).json({ error: err });
    }
};

const getUserByEmail = async (req: Request, res: Response) => {
    logging.info(`${NAMESPACE}: Getting the User with matching email`);
    const email = req.body.email;
    try {
        // Check request body
        if (!email) throw new TypeError('Where is the email, Lebowski?');

        // Regex match for email
        if (!email.match(emailRegex)) throw new Error('Not an email input.');

        // Call service layer
        const result = await userService.getUserByEmail(email);

        // Return result
        return res.status(200).json(result);
    } catch (error) {
        // Return error caught during check or user-service call
        const err = error as Error;
        logging.error(err.message);
        return res.status(500).json({ error: err });
    }
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail };
