import app from "./app";
import config from "./config/config";
import { logger } from "./config/logger";


const NAMESPACE = "Server";

/** Open port */
const server = app.listen(config.server.port, () => {
    logger.info(`${NAMESPACE}: Server is running ${config.server.hostname}:${config.server.port}`);
});

export default server;