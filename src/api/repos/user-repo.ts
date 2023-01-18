import { Activity, User } from '../models';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { createNewObjectCaughtError } from './error';

type UserDTO = Pick<User,'id'| 'firebase_id' | 'firstName' | 'lastName' | 'email' | 'phone' |'countryCode' >

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
//  Create a simple user with verified input
const createSimpleUser = async (user: any): Promise<UserDTO> => {
    await User.sync();
    return await User.create({
        firebase_id: user.firebase_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone : '',
        countryCode: user.countryCode ? user.countryCode : undefined
    }).catch((err) => {
        var messages = '';
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((value: ValidationErrorItem) => {
                messages = messages.concat(`${value.path} is already taken. \n`);
            });
            throw new APIError(`${messages.trim()}`, 'createSimpleUser', httpStatusCode.CONFLICT, true);
        }
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });


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

// Update User
// matcher: {email: 'email@here.com'} or {firstName: 'John', lastName: 'Doe'} or ...
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

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, updateUser, addNewUserActivity };
