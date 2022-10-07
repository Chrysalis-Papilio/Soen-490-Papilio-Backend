import { userRepos } from '../repos';
import { logging } from '../../config';

const NAMESPACE = 'services/user';

const getAllUsers = async () => {
    logging.info(`${NAMESPACE}: Servicing getAllUsers`);
    return userRepos.getAllUsers();
};

const createSampleUser = async () => {
    logging.info(`${NAMESPACE}: Servicing createSampleUser`);
    return userRepos.createSampleUser();
};

const createSimpleUser = async (user: any) => {
    logging.info(`${NAMESPACE}: Servicing creatingSimpleUser`);
    return userRepos.createSimpleUser(user);
};

const getUserByEmail = async (email: string) => {
    logging.info(`${NAMESPACE}: Servicing findUserByEmail`);
    return userRepos.getUserByEmail(email);
};

const updateUserProfile = async (fields: string[], user: any) => {
    logging.info(`${NAMESPACE}: Servicing updateUserProfile`);
    let matcher = {};
    fields.forEach((field: string) => {
        // @ts-ignore
        matcher[field] = user[field];
    });
    console.log(matcher, user);
    return userRepos.updateUser(matcher, user);
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
