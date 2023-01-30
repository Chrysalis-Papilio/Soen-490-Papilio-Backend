import dotenv from 'dotenv';
dotenv.config();

//** NEO4J variables */
const NEO4J_USER = process.env.NEO4J_USER || '';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || '';
const NEO4J_HOST = process.env.NEO4J_HOST || '';
const NEO4J_DATABASE = process.env.NEO4J_DATABASE || '';

//** SERVER variables */
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 1337;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600; // expire time in seconds
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIsuer'; //  organization name
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret'; //  encrypting jwt

//** SEQUELIZE variables */
const SEQUELIZE_DATABASE = process.env.DATABASE_URL;

//** Defining NEO4J Object */
const NEO4J = {
    host: NEO4J_HOST,
    database: NEO4J_DATABASE,
    user: NEO4J_USER,
    password: NEO4J_PASSWORD
};

//** Defining SERVER Object */
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

//** Defining NEO4J Object */
const SEQUELIZE = {
    database: SEQUELIZE_DATABASE
};

//** Defining CONFIG Object */
const config = {
    neo4j: NEO4J,
    sequelize: SEQUELIZE,
    server: SERVER
};

export default config;
