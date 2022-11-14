import { User } from '../models/User';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { ValidationErrorItem } from 'sequelize';

type UserDTO = Pick<User,'id'| 'firebase_id' | 'firstName' | 'lastName' | 'email' | 'phone' |'countryCode' >

// Get all accounts from table account
const getAllUsers = async (): Promise<UserDTO []> => {
    await User.sync();
    return User.findAll();
};

//  Get User from email
const getUserByEmail = async (email: string): Promise<UserDTO> => {
    await User.sync();
    return await User.findOne({
        where: { email: email }
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleUser', httpStatusCode.INTERNAL_SERVER, true);
    }) as UserDTO;
};

// Create a sample user with hardcoded info (test-only)
const createSampleUser = async (): Promise<UserDTO> => {
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
};

// Update User
// matcher: {email: 'email@here.com'} or {firstName: 'John', lastName: 'Doe'} or ...
const updateUser = async (identifier: any, update: any) => {
    await User.sync();
    var result = await User.update(update, { returning: true, where: identifier }).catch((err) => {
        var messages = '';
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((value: ValidationErrorItem) => {
                messages = messages.concat(`${value.path} is already taken. \n`);
            });
            throw new APIError(`${messages.trim()}`, 'updateUserProfile', httpStatusCode.CONFLICT, true);
        }
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'updateUserProfile', httpStatusCode.INTERNAL_SERVER, true);
    });
    if (result[0] === 0)        //  Failure to update
        throw new APIError('The user does not exist.', 'updateUserProfile', httpStatusCode.CONFLICT, true);
    else if (result[0] === 1)
        return result[1];       //  Successful update
    return result;              //  Unexpected result
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUser };
