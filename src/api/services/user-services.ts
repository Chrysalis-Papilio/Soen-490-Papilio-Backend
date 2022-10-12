import { userRepos } from '../repos';
import { logger } from '../../config/logger';

const getAllUsers = async () => {
    return userRepos.getAllUsers();
};

const createSampleUser = async () => {
    return userRepos.createSampleUser();
};

const createSimpleUser = async (user: any) => {
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
    logger.info(matcher, user);
    return userRepos.updateUser(matcher, user);
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
