import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class User extends Model {
    declare id: number;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        countryCode: {
            type: DataTypes.STRING(5),
            defaultValue: '1',
        },
        phone: {
            type: DataTypes.STRING(10),
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    { sequelize }
);

export { User };
