import { User } from '../models/User';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { logger } from '../../config/logger';

// Get all accounts from table account
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
        firebase_id: user.firebase_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone : undefined,
        countryCode: user.countryCode ? user.countryCode : undefined
    }).catch((err) => {
        if (err.message === 'Validation error')
            throw new APIError('This user already exists.', 'createSimpleUser', httpStatusCode.CONFLICT, true);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

//  Get User from email
const getUserByEmail = async (email: string) => {
    await User.sync();
    return await User.findOne({
        where: { email: email }
    }).catch((err) => {
        if (err.message === 'Validation error')
            throw new APIError('This user already exists.', 'createSimpleUser', httpStatusCode.CONFLICT, true);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

// Update User
// matcher: {email: 'email@here.com'} or {firstName: 'John', lastName: 'Doe'} or ...
const updateUser = async (identifier: any, update: any) => {
    await User.sync();
    return await User.update(update, 
        {returning: true, where: {id: identifier.id}}
        )
        .catch((err) => {
            logger.error(err)
            if (err.message === 'Validation error')
                throw new APIError(`This ${Object.keys(update)} is already in use.`, 'createSimpleUser', httpStatusCode.CONFLICT, true);
            throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUser };
