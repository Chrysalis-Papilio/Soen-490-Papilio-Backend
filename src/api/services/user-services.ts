import { userRepos } from '../repos';

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

const updateUserProfile = async (identifier: any, update: any) => {
    return userRepos.updateUser(identifier, update);
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
