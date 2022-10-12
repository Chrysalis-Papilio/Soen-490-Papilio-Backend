import {User} from '../models/User';
import {httpStatusCode} from '../../types/httpStatusCodes';
import {logger} from '../../config/logger';
import {APIError} from '../../errors/api-error';
import {BaseError} from '../../errors/base-error';

//** Get all accounts from table account */
const getAllUsers = async () => {
    await User.sync();
    return User.findAll();
};

// Create a sample user with hardcoded info (test-only)
const createSampleUser = async () => {
    await User.sync();
    return await User.create({
        firstName: 'Sample',
        lastName: 'User',
        phone: '5145551237',
        email: 'sample4@gmail.com',
        firebase_id: 'totallynotanid'
    });
};

//  Create a simple user with verified input
const createSimpleUser = async (user: any) => {
    await User.sync();
    return await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode ? user.countryCode : undefined,
        phone: user.phone ? user.phone : undefined,
        firebase_id: user.firebase_id
    }).catch((error) => {
        logger.error(error.message);
        if (error.message === 'Validation error')
            throw new APIError('This user already exists.', 'createSimpleUser', httpStatusCode.CONFLICT, true);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

//  Get User from email
const getUserByEmail = async (email: string) => {
    await User.sync();
    const result = await User.findOne({
        where: { email: email },
    });
    logger.info(`Getting user ${email}: ${result}.`);
    return result;
};

// Update User
// matcher: {email: 'email@here.com'} or {firstName: 'John', lastName: 'Doe'} or ...
const updateUser = async (matcher: any, user: any) => {
    await User.sync();
    return await User.update(user, {
        where: matcher,
    });
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUser };
