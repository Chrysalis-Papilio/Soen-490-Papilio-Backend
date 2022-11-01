import { userRepo } from '../repos';

const getAllUsers = async () => {
    return userRepo.getAllUsers();
};

const getUserById = async (id: string) => {
    return userRepo.getUserById(id);
};

const getUserByEmail = async (email: string) => {
    return userRepo.getUserByEmail(email);
};

const createSimpleUser = async (user: any) => {
    return userRepo.createSimpleUser(user);
};

const updateUserProfile = async (identifier: any, update: any) => {
    return userRepo.updateUser(identifier, update);
};

export { getAllUsers, createSimpleUser, getUserById, getUserByEmail, updateUserProfile };
