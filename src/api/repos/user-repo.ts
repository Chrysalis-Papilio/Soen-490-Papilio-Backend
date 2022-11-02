import { User } from '../models';
import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { ValidationErrorItem } from 'sequelize';

/** Get all accounts from table account */
const getAllUsers = async () => {
    await User.sync();
    return User.findAll({
        attributes: { exclude: ['id'] }
    });
};

/** Get User from firebase_id */
const getUserById = async (id: string) => {
    await User.sync();
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
    await User.sync();
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
    await User.sync();
    await User.create({
        firebase_id: user.firebase_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone : undefined,
        countryCode: user.countryCode ? user.countryCode : undefined
    }).catch((err) => {
        let messages = '';
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((value: ValidationErrorItem) => {
                messages = messages.concat(`${value.path} is already taken. \n`);
            });
            throw new APIError(`${messages.trim()}`, 'createUser', httpStatusCode.CONFLICT, true);
        }
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createUser', httpStatusCode.INTERNAL_SERVER, true);
    });
    return await getUserById(user.firebase_id);
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

export { getAllUsers, createUser, getUserById, getUserByEmail, updateUser };
