import { Request, Response, NextFunction } from 'express';
import { userServices } from '../services';
import { uploadImageFirebase } from '../../config/storage';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { APIError } from '../../errors/api-error';

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

const getUserFavoriteActivityList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /** Call to service layer */
        const { id } = req.params;
        const result = await userServices.getUserFavoriteActivityList(id);

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
    /** Get the user firebase id (identifier) and the id of the activity we want to favorite (update) */
    const { identifier } = req.body;
    let { update } = req.body;

    try {
        /** Verify user exists */
        const userCheck = await userServices.getUserById(identifier.firebase_id);

        /** If user exists */
        if (userCheck.user) {
            /** array to be sent to the update method in the service layer */
            let favoriteActivitiesOld = userCheck.user.favoriteActivities;

            /** If the user already has a list of favorite activities, then we will modify the current list and send it to the service layer*/
            if (userCheck.user.favoriteActivities) {
                const index = favoriteActivitiesOld.findIndex((element) => element == update.favoriteActivities);

                /** If the current activity was not already favorited, then add it to the user's list of favorites*/
                if (index == -1) {
                    favoriteActivitiesOld.push(update.favoriteActivities);
                } /** If the current activity was already favorited in the past, then simply un-favorite it*/ else {
                    favoriteActivitiesOld.splice(index, 1);
                }
            } /** If the user had not favorited any activity before this, then we create a new array and add our current activity on it, then send this array to the service layer to update the user model */ else {
                favoriteActivitiesOld = [update.favoriteActivities];
            }

            /** Assigning our new array to the update variable so it can be sent to the service layer and update the user's list of favorite activities**/
            update = { favoriteActivities: favoriteActivitiesOld };

            /** Call service layer - Reusing the updateUserProfile call for this whole route */
            const result = await userServices.updateUserProfile(identifier, update);

            /** Return result */
            return res.status(200).json(result);
        } else {
            throw new APIError('The user does not exist.', 'addFavoriteActivity', httpStatusCode.BAD_REQUEST, true); /** If user doesn't exist */
        }
    } catch (err) {
        next(err);
    }
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

        /** Once the activity is created, we can create a chat for it */
        await userServices.createChat(id.toString(), result.activity.id.toString(), result.activity.title);

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

const getChatUserToken = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  try {
        /** Call to service layer */
        const result = await userServices.generateChatTokenForUser(userId);

        /** Return a response to client */
        return res.status(200).json(result);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.created_by_id;
  const channelName = req.body.channel_name;
  const channelId = req.body.channel_id;
  try {
        /** Call to service layer */
        const code = await userServices.createChat(userId, channelId, channelName);

        /** Return a response to client */
        return res.sendStatus(code);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const deleteActivityChat = async (req: Request, res: Response, next: NextFunction) => {
  const channelId = req.params.channel_id;
  try {
        /** Call to service layer */
        const code = await userServices.deleteActivityChat(channelId);

        /** Return a response to client */
        return res.sendStatus(code);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const addMemberToActivityChat = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.body.user_id;
  const channel_id = req.body.channel_id;
  const user_name = req.body.user_name;
  try {
        /** Call to service layer */
        const code = await userServices.addMemberToActivityChat(user_id, user_name, channel_id);

        /** Return a response to client */
        return res.sendStatus(code);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const removeMemberFromActivityChat = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.body.user_id;
  const channel_id = req.body.channel_id;
  try {
        /** Call to service layer */
        const code = await userServices.removeMemberFromActivityChat(user_id, channel_id);

        /** Return a response to client */
        return res.sendStatus(code);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

const createNewStreamChatUser = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.body.id;
  const user_name = req.body.name;
  try {
        /** Call to service layer */
        const code = await userServices.createNewStreamChatUser(user_id, user_name);

        /** Return a response to client */
        return res.sendStatus(code);
    } catch (err) {
        next(err); //  Send any error to error-handler
    }
};

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, getUserFavoriteActivityList, updateUserProfile, addFavoriteActivity, addNewUserActivity, submitQuiz, getChatUserToken, createChat, deleteActivityChat, addMemberToActivityChat, createNewStreamChatUser, removeMemberFromActivityChat };
