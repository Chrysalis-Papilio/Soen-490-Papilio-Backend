import * as userRepos from '../repos/user';
import logging from '../config/logging';

const NAMESPACE = 'services/user';

//Fetch Account Service (#TODO why do we need this again aside from testing?)
const getAllUsers = async () => {
    logging.info(NAMESPACE, 'Servicing all users from the database.');
    return userRepos.getAllUsers();
};

export { getAllUsers };
