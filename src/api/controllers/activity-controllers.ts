import { NextFunction, Request, Response } from 'express';
import { activityServices } from '../services';

const getAllActivities = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const result = await activityServices.getAllActivities();
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export { getAllActivities };
