import { businessServices } from '../services';
import { Request, Response, NextFunction } from 'express';

const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const id = parseInt(req.params.id);
        const result = await businessServices.getBusinessById(id);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const createBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const business = { name: req.body.name };
        const result = await businessServices.createBusiness(business);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const updateBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const id = { id: parseInt(req.params.id) };
        const update = req.body;
        const result = await businessServices.updateBusiness(id, update);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export { getBusinessById, createBusiness, updateBusiness };
