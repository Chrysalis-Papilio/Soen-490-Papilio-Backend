import {DataTypes, Model} from "sequelize";
const Watchlist = require("./Watchlist");
const ActivityReview = require("./ActivityReview");
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
        },
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
        unique: true
    },
}, {sequelize: database});

User.hasOne(Watchlist, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.hasMany(ActivityReview, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

module.exports = User;
