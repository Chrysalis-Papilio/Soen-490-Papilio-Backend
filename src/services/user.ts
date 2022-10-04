import * as userRepos from '../repos/user';

// const NAMESPACE = 'services/user';

//Fetch Account Service (#TODO why do we need this again aside from testing?)
const getAllUsers = async () => {
    return userRepos.getAllUsers();
};

const createSampleUser = async () => {
    return userRepos.createSampleUser();
};

export { getAllUsers, createSampleUser };
