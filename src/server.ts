import app from './app'
import config from './config/config'
import { logger } from './config/logger'

/** Open port */
app.listen(config.server.port, () => {
    logger.info(`Server is running ${config.server.hostname}:${config.server.port}`);
});