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

const generateChatTokenForUser = async(userId: string) => {
    return userRepo.generateChatTokenForUser(userId);
};

const createChat = async(userId: string, channelId: string, channelName: string) => {
    return userRepo.createChat(userId, channelId, channelName);
};

const deleteActivityChat = async(channelId: string) => {
    return userRepo.deleteActivityChat(channelId);
};

const addMemberToActivityChat = async(user_id: string, user_name: string, channel_id: string) => {
    return userRepo.addMemberToActivityChat(user_id, user_name, channel_id);
};

const removeMemberFromActivityChat = async(user_id: string, channel_id: string) => {
    return userRepo.removeMemberFromActivityChat(user_id, channel_id);
};

const createNewStreamChatUser = async(user_id: string, user_name: string) => {
    return userRepo.createNewStreamChatUser(user_id, user_name);
};

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, getUserFavoriteActivityList, updateUserProfile, addNewUserActivity, submitQuiz, generateChatTokenForUser, createChat, deleteActivityChat, addMemberToActivityChat, createNewStreamChatUser, removeMemberFromActivityChat };
