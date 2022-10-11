import { userRepos } from '../repos';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';

const getAllUsers = async () => {
    return userRepos.getAllUsers();
};

const createSampleUser = async () => {
    return userRepos.createSampleUser();
};

const createSimpleUser = async (user: any) => {
    // Check for required request body
    if (!user.firstName) {
        const errMessage = 'Missing firstname.';
        throw new APIError(errMessage, 'createSimpleUser', httpStatusCode.BAD_REQUEST);
    }
    if (!user.lastName) {
        const errMessage = 'Missing lastname.';
        throw new APIError(errMessage, 'createSimpleUser', httpStatusCode.BAD_REQUEST);
    }
    if (!user.email) {
        const errMessage = 'Missing email.';
        throw new APIError(errMessage, 'createSimpleUser', httpStatusCode.BAD_REQUEST);
    }
    return userRepos.createSimpleUser(user);
};
const getUserByEmail = async (email: string) => {
    return userRepos.getUserByEmail(email);
};

const updateUserProfile = async (fields: string[], user: any) => {
    let matcher = {};
    fields.forEach((field: string) => {
        // @ts-ignore
        matcher[field] = user[field];
    });
    console.log(matcher, user);
    return userRepos.updateUser(matcher, user);
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
