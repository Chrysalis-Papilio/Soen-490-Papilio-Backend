import { Sequelize } from 'sequelize';
import config from './config';

const sequelize = new Sequelize(`${config.sequelize.database}`);

export { sequelize };
