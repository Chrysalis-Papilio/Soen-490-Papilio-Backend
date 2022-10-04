import { queryDatabase } from '../DatabaseServices/psql';
import logging from '../config/logging';

const NAMESPACE = 'repos/user';

//Get all accounts from table account
const getAllUsers = async () => {
    logging.info(NAMESPACE, 'Querying all users from the database.');
    const query = `SELECT * FROM overall`;
    return queryDatabase(query);
};

export { getAllUsers };
