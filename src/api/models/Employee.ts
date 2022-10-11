import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

const { Business } = require('./Business');

class Employee extends Model {
    declare id: number;
}

Employee.init(
    {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        role: {
            // TODO: Not sure on this one yet, could be ENUM or INT
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize
    }
);

Employee.belongsTo(Business, {
    as: 'Business',
    foreignKey: 'business_id'
});

module.exports = Employee;
