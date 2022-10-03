import {DataTypes, Model} from "Sequelize";
const database = require("../database");

class User extends Model {
    declare id: number;
}

User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    watchlist_id: {
        type: DataTypes.INTEGER
    }
}, {sequelize: database});

module.exports = User;
