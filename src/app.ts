import express from 'express';
import { logger } from './config/logger';
import { ErrorHandler } from './errors/error-handler';
import { userRoute, activityRoute, businessRoute, genreRoute } from './api/routes';
import config from './config/config';

const NAMESPACE = 'App';

const app = express();
const errorHandler = new ErrorHandler();

/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logger.info(`Incoming -> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logger.info(`Outgoing -> METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Rules of API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        logger.info('Stop');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

/** Open port */
export const server = app.listen(config.server.port, () => {
    logger.info(`${NAMESPACE}: Server is running ${config.server.hostname}:${config.server.port}`);
});

/** Routes go here */
app.use('/api', userRoute);
app.use('/api', activityRoute);
app.use('/api', businessRoute);
app.use('/api', genreRoute);

/** Error handling */
app.use(errorHandler.handleError);

process.on('uncaughtException', async (error: Error) => {
    await errorHandler.handleError; //  Handle the uncaughException
    logger.info('Gracefully exiting...');
    if (!errorHandler.isTrustedError(error)) process.exit(1); //  Exit if its a programmer error
});

/** Get unhandled rejection and throw it to another fallback handler. */
process.on('unhandledRejection', (reason: Error) => {
    throw reason;
});

export default app;
