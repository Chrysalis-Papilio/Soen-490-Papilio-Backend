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

const getUserFavoriteActivityList = async (id: string) => {
    return userRepo.getUserFavoriteActivityList(id);
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

const checkJoinedActivity = async (id: string, activityId: number) => {
    return userRepo.checkJoinedActivity(id, activityId);
};

const joinActivity = async (id: string, activityId: number) => {
    return userRepo.joinActivity(id, activityId);
};

const unjoinActivity = async (id: string, activityId: number) => {
    return userRepo.unjoinActivity(id, activityId);
};

export {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    getUserActivityList,
    getUserFavoriteActivityList,
    updateUserProfile,
    addNewUserActivity,
    submitQuiz,
    checkJoinedActivity,
    joinActivity,
    unjoinActivity
};
