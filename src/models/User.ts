import {DataTypes, Model} from "sequelize";
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
        allowNull: false,
        validate: {
            validFirstName(value: String) {
                if (value.length < 2) {
                    throw new Error("First name too short!");
                }
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            validLastName(value: String) {
                if (value.length < 2) {
                    throw new Error("Last name too short!");
                }
            }
        }
    },
    countryCode: {
        type: DataTypes.STRING(5),
        defaultValue: '1',
        validate: {
            isNumeric: true,
        }
    },
    phone: {
        type: DataTypes.STRING(10),
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    watchlist_id: {
        type: DataTypes.INTEGER
    }
}, {sequelize: database});

module.exports = User;
