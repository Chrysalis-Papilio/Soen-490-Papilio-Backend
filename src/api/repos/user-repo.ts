import logging from '../../config/logging';
import { User } from '../models/User';

const NAMESPACE: String = 'repos/userRepos';

// Get all accounts from table account
const getAllUsers = async () => {
    logging.info(`${NAMESPACE}: Querying all users.`);
    await User.sync();
    return User.findAll();
};

// Create a sample user with hardcoded info (test-only)
const createSampleUser = async () => {
    logging.info(`${NAMESPACE}: Creating a sample user.`);
    await User.sync({ alter: true });
    return await User.create({
        firstName: 'Sample',
        lastName: 'User',
        phone: '5145551237',
        email: 'sample4@gmail.com'
    });
};

// Create a simple user with verified input
const createSimpleUser = async (user: any) => {
    logging.info(`${NAMESPACE}: Creating a simple user with request body.`);
    await User.sync({ alter: true });
    return await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode ? user.countryCode : undefined,
        phone: user.phone ? user.phone : undefined
    });
};

// Get User from email
const getUserByEmail = async (email: String) => {
    logging.info(`${NAMESPACE}: Getting User from email.`);
    await User.sync({ alter: true });
    return await User.findOne({ where: { email: email } });
};

export { getAllUsers, createSampleUser, createSimpleUser, getUserByEmail };
