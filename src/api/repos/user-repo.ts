import { User } from '../models';
import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { ValidationErrorItem } from 'sequelize';

/** Get all accounts from table account */
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

/**  Create a simple user with verified input */
const createSimpleUser = async (user: User) => {
    await User.sync();
    return await User.create({
        firebase_id: user.firebase_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone : undefined,
        countryCode: user.countryCode ? user.countryCode : undefined
    }).catch((err) => {
        var messages = '';
        //  console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((value: ValidationErrorItem) => {
                messages = messages.concat(`${value.path} is already taken. \n`);
            });
            throw new APIError(`${messages.trim()}`, 'createSimpleUser', httpStatusCode.CONFLICT, true);
        }
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

/**  Get User from email */
const getUserByEmail = async (email: string) => {
    await User.sync();
    return await User.findOne({
        where: { email: email }
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    });
};

/** Update User */
const updateUser = async (identifier: any, update: any) => {
    await User.sync();
    const result = await User.update(update, { returning: true, where: identifier }).catch((err) => {
        let messages = '';
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((value: ValidationErrorItem) => {
                messages = messages.concat(`${value.path} is already taken. \n`);
            });
            throw new APIError(`${messages.trim()}`, 'updateUserProfile', httpStatusCode.CONFLICT, true);
        }
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'updateUserProfile', httpStatusCode.INTERNAL_SERVER, true);
    });
    if (result[0] === 0)
        //  Failure to update
        throw new APIError('The user does not exist.', 'updateUserProfile', httpStatusCode.CONFLICT, true);
    else if (result[0] === 1) return result[1]; //  Successful update
    return result; //  Unexpected result
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUser };
