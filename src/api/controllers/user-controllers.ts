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

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    try {
        /** Call to service layer */
        const statusCode = await userServices.createUser(user);

        /** Return a response to client. */
        return res.sendStatus(statusCode);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        /** Call to service layer */
        const result = await userServices.getUserById(id);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    try {
        /** Call to service layer */
        const result = await userServices.getUserByEmail(email);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, update } = req.body;
    try {
        /** Call service layer */
        const result = await userServices.updateUserProfile(identifier, update);

        /** Return result */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const addNewUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { activity, address = null } = req.body;
    try {
        /** Call to service layer */
        const result = await userServices.addNewUserActivity(id, activity, address);

        /** Return a response to client */
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export { getAllUsers, createUser, getUserById, getUserByEmail, updateUserProfile, addNewUserActivity };
