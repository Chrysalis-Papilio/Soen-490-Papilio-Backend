import { businessServices } from '../services';
import { Request, Response, NextFunction } from 'express';

const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const businessId = req.params.businessId.toString();
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
        const businessId = req.params.businessId.toString();
        const result = await businessServices.getEmployeeList(businessId);

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
        const business = req.body.business;
        const employee = req.body.employee;
        const address = req.body.address;
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
        const update = req.body;
        const result = await businessServices.updateBusiness(id, update);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export { getBusinessById, getEmployeeList, createSimpleBusiness, createBusiness, updateBusiness };
