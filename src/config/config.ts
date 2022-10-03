import dotenv from 'dotenv';
dotenv.config();

//  MYSQL variables
const MYSQL_USER = process.env.MYSQL_USER || '';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_HOST = process.env.MYSQL_HOST || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || '';

//  NEO4J variables
const NEO4J_USER = process.env.MYSQL_USER || '';
const NEO4J_PASSWORD = process.env.MYSQL_PASSWORD || '';
const NEO4J_HOST = process.env.MYSQL_HOST || '';
const NEO4J_DATABASE = process.env.MYSQL_DATABASE || '';

//  Defining MYSQL Object
const MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
};

//  Defining NEO4J Object
const NEO4J = {
    host: NEO4J_HOST,
    database: NEO4J_DATABASE,
    user: NEO4J_USER,
    password: NEO4J_PASSWORD
};


//  SERVER variables
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 1337;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600; // expire time in seconds
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIsuer'; //  organization name
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret'; //  encrypting jwt

// Defining SERVER Object
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
// Defining CONFIG Object
const config = {
    mysql: MYSQL,
    neo4j: NEO4J,
    server: SERVER
};

export default config;