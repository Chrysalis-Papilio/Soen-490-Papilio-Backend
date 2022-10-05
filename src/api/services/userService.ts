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

export { getAllUsers, createSampleUser };
