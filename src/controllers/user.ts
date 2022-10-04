import { Request, Response } from 'express';
import * as userService from '../services/user';
import logging from '../config/logging';

const NAMESPACE = 'controllers/user';

const getAllUsers = async (_: Request, res: Response) => {
    logging.info(NAMESPACE, 'Controlling all users from PSQL Database');
    try {
        //  Call to service layer
        const result = await userService.getAllUsers();

        // Return a response to client.
        return res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        logging.error(NAMESPACE, err.message);

        // Return a response to client.
        return res.status(500).json({
            error: error
        });
    }
};

const createSampleUser = async (_: Request, res: Response) => {
    logging.info(NAMESPACE, 'Creating a sample user');
    try {
        //  Call to service layer
        const result = await userService.createSampleUser();

        // Return a response to client.
        return res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        logging.error(NAMESPACE, err.message);

        // Return a response to client.
        return res.status(500).json({
            error: error
        });
    }
};

export { getAllUsers, createSampleUser };
