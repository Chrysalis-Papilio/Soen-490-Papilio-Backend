import { Request, Response, NextFunction } from 'express';
import { userServices } from '../services';
import { uploadImageFirebase } from '../../config/storage';

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

const getUserActivityList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { id } = req.params;
        const result = await userServices.getUserActivityList(id);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err);
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


const addFavoriteActivity = async (req: Request, res: Response, next: NextFunction) => {

    const { identifier } = req.body
    var { update } = req.body

    const userCheck = await userServices.getUserById(identifier.firebase_id);

    if(userCheck.found && userCheck.user)
    {
        var favoriteActivitiesOld = userCheck.user.favoriteActivities

        if(userCheck.user.favoriteActivities)
        {
            const index = favoriteActivitiesOld.findIndex((element) => element == update.favoriteActivities)

            if(index == -1)
            {
                favoriteActivitiesOld.push(update.favoriteActivities)
            }
            else
            {
                favoriteActivitiesOld.splice(index, 1)
            }
        }
        else
        {
            var newArray = [update.favoriteActivities]
            favoriteActivitiesOld = newArray
            console.log('bengbongogogsgdsdgsd')
        }

        update = {favoriteActivities: favoriteActivitiesOld}
        console.log(update)

        try {
            /** Call service layer */
            const result = await userServices.updateUserProfile(identifier, update);
    
            /** Return result */
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
    else return res.status(404).json("User not found!");


    
};


const addNewUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
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
        const result = await userServices.addNewUserActivity(id, activity);

        /** Return a response to client */
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const indoor: boolean = req.body.indoor;
    const outdoor: boolean = req.body.outdoor;
    const genres: number[] = req.body.genres;
    const id: string = req.params.id;
    try {
        /** Call to service layer */
        const result = await userServices.submitQuiz(id, { indoor: indoor, outdoor: outdoor, genres: genres });

        /** Response is a status code */
        return res.sendStatus(result);
    } catch (err) {
        next(err);
    }
};

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, updateUserProfile, addFavoriteActivity, addNewUserActivity, submitQuiz };
