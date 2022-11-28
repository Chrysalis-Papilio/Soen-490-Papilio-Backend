import { User } from '../models';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { createNewObjectCaughtError } from './error';

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

export { getAllUsers, createUser, getUserById, getUserByEmail, updateUser };
