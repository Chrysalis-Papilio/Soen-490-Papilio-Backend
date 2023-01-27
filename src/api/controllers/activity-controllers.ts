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

const getActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    try {
        /** Call to service layer */
        const result = await activityServices.getActivity(Number(activityId));

        /** Return a response */
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export { getAllActivities, getActivity };
