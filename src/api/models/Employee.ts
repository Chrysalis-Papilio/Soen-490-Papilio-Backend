import { CreationOptional, DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

class Employee extends Model {
    declare id: CreationOptional<number>;
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
        }
    },
    {
        sequelize
    }
);

export { Employee };
