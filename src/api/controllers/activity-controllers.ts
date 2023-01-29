import { NextFunction, Request, Response } from 'express';
import { activityServices } from '../services';

const DEFAULT_PAGE = 1;
const MAX_PER_PAGE = 20;

const getAllActivities = async (req: Request, res: Response, next: NextFunction) => {
    /** Values for response pagination */
    const page = req.query.page ? Number(req.query.page) : DEFAULT_PAGE;
    const size = req.query.size ? Number(req.query.size) : MAX_PER_PAGE;

    try {
        /** Call to service layer */
        const result = await activityServices.getAllActivities(page, size);

        /** Paginated response */
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
