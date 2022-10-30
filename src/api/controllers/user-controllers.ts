import { Request, Response, NextFunction } from 'express';
import { userServices } from '../services';

const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
        /**  Call to service layer */
        const result = await userServices.getAllUsers();

        /**  Return a response to client. */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createSampleUser = async (_: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const result = await userServices.createSampleUser();

        /** Return a response to client. */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createSimpleUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    try {
        /** Call to service layer */
        const result = await userServices.createSimpleUser(user);

        /** Return a response to client. */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    try {
        const result = await userServices.getUserByEmail(email); //  Call to service Layer.
        return res.status(200).json(result); //  Return a response to client.
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.body.identifier;
    const update = req.body.update;
    try {
        // Call service layer
        const result = await userServices.updateUserProfile(identifier, update);

        // Return result
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
