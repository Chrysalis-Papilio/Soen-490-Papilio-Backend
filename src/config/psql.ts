import psql from 'pg';
import config from './config';
import logging from './logging';

const NAMESPACE = 'psql';

const client = new psql.Client({
    host: config.psql.host,
    user: config.psql.user,
    password: config.psql.password,
    database: config.psql.database
});

//  Connecting to database
const Connect = async () => {
    logging.info(NAMESPACE, 'Connecting to server...');
    try {
        await client.connect();
    } catch (error) {
        if (error instanceof Error) logging.error(NAMESPACE, error.message, error);
        else console.log('Unexpected error: ', error);
    }
};

//  Querying the database
const Query = async (query: string) => {
    logging.info(NAMESPACE, 'Querying server...');
    try {
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        return [];
    }
};

const Disconnect = async () => {
    try {
        await client.end();
        logging.info(NAMESPACE, 'Disconnecting server...');
    } catch (error) {
        if (error instanceof Error) logging.error(NAMESPACE, error.message, error);
        else console.log('Unexpected error: ', error);
    }
};

export { Connect, Query, Disconnect };
