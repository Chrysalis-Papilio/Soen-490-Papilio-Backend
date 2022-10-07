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

export { getAllUsers, createSampleUser, createSimpleUser };
