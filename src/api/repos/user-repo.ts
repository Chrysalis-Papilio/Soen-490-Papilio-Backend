import { Activity, User } from '../models';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { createNewObjectCaughtError } from './error';
import { Favorite_Activities } from '../models/User';

/** Get all accounts from table account */
const getAllUsers = async () => {
    await User.sync({ alter: true });
    return User.findAll({
        attributes: { exclude: ['id'] }
    });
};

/** Get User from firebase_id */
const getUserById = async (id: string) => {
    await User.sync({ alter: true });
    const user = await User.findOne({
        where: { firebase_id: id },
        attributes: { exclude: ['id'] }
    });
    return {
        found: !!user,
        user: user
    };
};

/**  Get User from email */
const getUserByEmail = async (email: string) => {
    await User.sync({ alter: true });
    const user = await User.findOne({
        where: { email: email },
        attributes: { exclude: ['id'] }
    });
    return {
        found: !!user,
        user: user
    };
};

/** Get The List of Activity Created by User */
const getUserActivityList = async (id: string) => {
    await User.sync({ alter: true });
    await Activity.sync({ alter: true });
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'getUserActivityList', httpStatusCode.CONFLICT);
    }
    return {
        count: (await user.countActivities()) || 0,
        activities: await user.getActivities()
    };
};

/**  Create a simple user with verified input */
const createUser = async (user: User) => {
    await User.sync({ alter: true });

    // Check if the user is already in the database, if so, do nothing
    const checkForAlreadyExistingUser = await getUserById(user.firebase_id);

    if (!checkForAlreadyExistingUser.found) {
        await User.create({
            firebase_id: user.firebase_id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone ? user.phone : undefined,
            countryCode: user.countryCode ? user.countryCode : undefined,
            bio: `Hello! I'm ${user.firstName}!`
        }).catch((err) => createNewObjectCaughtError(err, 'createUser', 'There has been an error in creating the User.'));
        return httpStatusCode.CREATED;
    }

    return httpStatusCode.OK;
};

/**  Add a favorite activity for the user */
const addFavoriteActivity = async (userId: string, activityId: number) => {

    await Favorite_Activities.sync({alter:true});

    await User.sync();
    await Activity.sync();

    const user = (await getUserById(userId)).user;

    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${userId}`, 'addFavoriteActivity', httpStatusCode.CONFLICT);
    }

    // const activity = await Activity.findOne(
    //     {
    //         where: {
    //             id: activityId
    //         }
    //     }
    // )
    
    // if(!activity)
    //     throw new APIError(`Cannot find activity with id ${activityId}`, 'addFavoriteActivity', httpStatusCode.CONFLICT);

    console.log(activityId)
    console.log(await user.findFavoriteActivity(activityId))

    if (!(await user.findFavoriteActivity(activityId))) {
        await user.addFavoriteActivity(activityId)
        .catch((err) => createNewObjectCaughtError(err, 'addFavorite', 'Yo this thing dont work'))
        return httpStatusCode.OK;
    }

    return httpStatusCode.OK;
};

/** Update User */
const updateUser = async (identifier: any, update: any) => {
    await User.sync({ alter: true });
    const result = await User.update(update, { returning: ['firebase_id', 'firstName', 'lastName', 'countryCode', 'phone', 'email', 'bio'], where: identifier }).catch((err) =>
        createNewObjectCaughtError(err, 'updateUser', 'There has been an error in updating User.')
    );
    if (!result[0])
        //  Failure to update
        throw new APIError('The user does not exist.', 'updateUserProfile', httpStatusCode.CONFLICT, true);
    else
        return {
            success: !!result[1][0],
            update: result[1][0]
        };
};

/** Create a new Activity associated with this User */
const addNewUserActivity = async (id: string, activity: Activity) => {
    await User.sync({ alter: true });
    await Activity.sync({ alter: true });
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'addNewUserActivity', httpStatusCode.CONFLICT);
    }
    const newActivity = await user
        .createActivity(activity, { returning: true })
        .catch((err) => createNewObjectCaughtError(err, 'addNewUserActivity', 'There has been an error in creating a new user Activity'));
    return {
        success: !!newActivity,
        activity: newActivity
    };
};

export { getAllUsers, createUser, addFavoriteActivity, getUserById, getUserByEmail, getUserActivityList, updateUser, addNewUserActivity };
