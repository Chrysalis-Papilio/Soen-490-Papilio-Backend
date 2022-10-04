import { Request, Response } from 'express';
import * as userService from '../services/user';
import logging from '../config/logging';

const NAMESPACE = 'controllers/user';

const getAllUsers = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, 'Controlling all users from PSQL Database');
    console.log(req.body);
    try {
        //  Call to service layer
        const result = await userService.getAllUsers();

        // Return a response to client.
        return res.status(200).json({
            status: 200,
            result: result
        });
    } catch (error) {
        const err = error as Error;
        logging.error(NAMESPACE, err.message);

        // Return a response to client.
        return res.status(500).json({
            status: 200,
            error: error
        });
    }
};

export { getAllUsers };
