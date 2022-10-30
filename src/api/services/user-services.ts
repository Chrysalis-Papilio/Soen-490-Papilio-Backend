import { userRepo } from '../repos';

const getAllUsers = async () => {
    return userRepo.getAllUsers();
};

const createSampleUser = async () => {
    return userRepo.createSampleUser();
};

const createSimpleUser = async (user: any) => {
    return userRepo.createSimpleUser(user);
};
const getUserByEmail = async (email: string) => {
    return userRepo.getUserByEmail(email);
};

const updateUserProfile = async (identifier: any, update: any) => {
    return userRepo.updateUser(identifier, update);
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail, updateUserProfile };
