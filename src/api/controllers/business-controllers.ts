import { businessServices } from '../services';
import { uploadImageFirebase } from '../../config/storage';
import { deleteEmployee } from '../../config/firebaseAdmin';
import { Request, Response, NextFunction } from 'express';

const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const result = await businessServices.getBusinessById(businessId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId, employeeId } = req.params;
        const result = await businessServices.getEmployee(businessId, employeeId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getEmployeeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const result = await businessServices.getEmployeeList(businessId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getActivityList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const result = await businessServices.getActivityList(businessId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createSimpleBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const business = req.body;
        const result = await businessServices.createSimpleBusiness(business);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { business, employee } = req.body;
        const result = await businessServices.createBusiness(business, employee);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const updateBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const id = { businessId: req.params.businessId };
        const { update } = req.body;
        const result = await businessServices.updateBusiness(id, update);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const addNewEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { employee } = req.body;
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const result = await businessServices.addNewEmployee(businessId, employee);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        try {
            await deleteEmployee(employee.firebase_id);
        } catch (e) {
            return next(e);
        }
        next(err);
    }
};

const addNewActivity = async (req: Request, res: Response, next: NextFunction) => {
    addNewBusinessActivity(req, res, next);
};

const addNewBusinessActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { businessId } = req.params;
    const { activity } = req.body;
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
        activity['images'] = imageUrls;

        /** Call to service layer */
        const result = await businessServices.addNewActivity(businessId, activity);

        /** Return a response to client */
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

const removeEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId, employeeId } = req.params;
        const result = await businessServices.removeEmployee(businessId, employeeId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const removeActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId, activityId } = req.params;
        const result = await businessServices.removeActivity(businessId, parseInt(activityId));

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const removeBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;
        const result = await businessServices.removeBusiness(businessId);

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId, employeeId } = req.params;
        const { update } = req.body;
        const result = await businessServices.updateEmployee(businessId, employeeId, update);

        /** Response */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId, activityId } = req.params;
        const { update } = req.body;
        const result = await businessServices.updateActivity(businessId, parseInt(activityId), update);

        /** Response */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const registerAdTier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const { adTier } = req.body;
        const result = await businessServices.registerAdTier(businessId, Number(adTier));

        /** Response */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const deregisterAdTier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const result = await businessServices.registerAdTier(businessId, 0);

        /** Response */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export {
    getBusinessById,
    getEmployee,
    getEmployeeList,
    getActivityList,
    createSimpleBusiness,
    createBusiness,
    addNewEmployee,
    addNewActivity,
    removeEmployee,
    removeActivity,
    removeBusiness,
    updateBusiness,
    updateEmployee,
    updateActivity,
    registerAdTier,
    deregisterAdTier
};
