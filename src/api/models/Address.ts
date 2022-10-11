import {CreationOptional, DataTypes, Model} from 'sequelize';
import { sequelize } from '../../config';

class Address extends Model {
    declare id: CreationOptional<number>;
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mention: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lineOne: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lineTwo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 4],
                isUppercase: true,
                isAlpha: true
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 7]
            }
        }
    },
    {
        sequelize
    }
);

export { Address };
