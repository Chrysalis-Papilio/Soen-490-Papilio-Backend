import { NextFunction, Request, Response } from 'express';
import { activityServices } from '../services';
import { uploadImageFirebase } from '../../config/storage';

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
    const contact = !!Number(req.query.contact);
    try {
        /** Call to service layer */
        const result = await activityServices.getActivity(Number(activityId), contact);

        /** Return a response */
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    const { update } = req.body;
    try {
        /** Call to service layer */
        const result = await activityServices.updateActivity(Number(activityId), update);

        /** Return a response */
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const closeActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    try {
        const result = await activityServices.closeActivity(Number(activityId));
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const openActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    try {
        const result = await activityServices.openActivity(Number(activityId));
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const updateActivityImages = async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    try {
        /** Check if middleware uploaded and retrieved the images' URLs */
        const imageUrls: string[] = [];
        if (req.files) {
            const fileKeys = Object.keys(req.files);
            for (const key of fileKeys) {
                // @ts-ignore - THIS IS NECESSARY
                const url = await uploadImageFirebase(req.files[key]);
                imageUrls.push(url);
            }
        }
        const update = { images: imageUrls };

        /** Call to service layer */
        const result = await activityServices.updateActivity(Number(activityId), update);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const searchActivities = async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.body;
    try {
        /** Call to service layer */
        const result = await activityServices.searchActivities(keyword.trim());

        /** Return a response */
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export { getAllActivities, getActivity, searchActivities, updateActivity, closeActivity, openActivity, updateActivityImages };

