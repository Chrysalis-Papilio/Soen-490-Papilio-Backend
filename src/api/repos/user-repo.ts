import logging from '../../config/logging';
import { User } from '../models/User';

const NAMESPACE: String = 'repos/userRepos';

// Get all accounts from table account
const getAllUsers = async () => {
    logging.info(`${NAMESPACE}: Querying all users.`);
    await User.sync();
    const result = User.findAll();
    return result;
};

// Get all accounts from table account
const createSampleUser = async () => {
    logging.info(`${NAMESPACE}: Creating a sample user.`);
    await User.sync({ alter: true });
    const result = await User.create({
        firstName: 'Sample',
        lastName: 'User',
        phone: '5145551237',
        email: 'sample5@gmail.com',
        firebase_id: 'nothing'
    });
    return result;
};

export { getAllUsers, createSampleUser };
