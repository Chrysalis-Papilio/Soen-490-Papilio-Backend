import express from 'express';
import { userRoute, activityRoute } from './api/routes';
import { config, logging } from './config';

const router = express();
const NAMESPACE = 'app';

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(`Incoming -> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logging.info(`Incoming -> METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes go here */
router.use('/api', userRoute);
router.use('/api', activityRoute);

/** Error handling */
router.use((req, res) => {
    const error = new Error('REST API endpoint does not exist.');
    console.log(req);
    res.status(404).json({
        message: error.message
    });
});

/** Open port */
router.listen(config.server.port, () => logging.info(`${NAMESPACE}: Server is running ${config.server.hostname}:${config.server.port}`));
