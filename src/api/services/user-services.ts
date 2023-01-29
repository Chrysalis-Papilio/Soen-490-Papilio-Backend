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

const getUserActivityList = async (id: string) => {
    return userRepo.getUserActivityList(id);
};

const createUser = async (user: any) => {
    return userRepo.createUser(user);
};

const updateUserProfile = async (identifier: any, update: any) => {
    return userRepo.updateUser(identifier, update);
};

const addNewUserActivity = async (id: string, activity: any) => {
    return userRepo.addNewUserActivity(id, activity);
};

const submitQuiz = async (id: string, quiz: any) => {
    return userRepo.submitQuiz(id, quiz);
};

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, updateUserProfile, addNewUserActivity, submitQuiz };
