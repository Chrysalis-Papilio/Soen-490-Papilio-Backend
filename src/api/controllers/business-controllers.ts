import { businessServices } from '../services';
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
        const { business, employee, address } = req.body;
        const result = await businessServices.createBusiness(business, employee, address);

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
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const { employee } = req.body;
        const result = await businessServices.addNewEmployee(businessId, employee);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const addNewActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { businessId } = req.params;
        const { activity, address = null } = req.body;
        const result = await businessServices.addNewActivity(businessId, activity, address);

        /** Return a response to client */
        return res.status(200).json(result);
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
}

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
}

export { getBusinessById, getEmployeeList, getActivityList, createSimpleBusiness, createBusiness, addNewEmployee, addNewActivity, removeEmployee, removeActivity, updateBusiness };
