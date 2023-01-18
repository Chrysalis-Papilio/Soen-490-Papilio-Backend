import { Request, Response, NextFunction } from 'express';
import { genreServices } from '../services';

const getAllGenres = async (_: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const result = await genreServices.getAllGenres();

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const addGenre = async (req: Request, res: Response, next: NextFunction) => {
    const { genre } = req.body;
    try {
        /** Call to service layer */
        const result = await genreServices.addGenre(genre);

        /** Return a response to client */
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export { getAllGenres, addGenre };
