import {Sequelize} from "Sequelize";
const database = new Sequelize(`${process.env.DATABASE_URL}`);

module.exports = database;
