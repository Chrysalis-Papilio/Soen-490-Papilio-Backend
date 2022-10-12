import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
import { Business } from './Business';

class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    declare id: CreationOptional<number>;
    declare mention: string | null;
    declare lineOne: string;
    declare lineTwo: string | null;
    declare city: string;
    declare state: string;
    declare country: string;
    declare postalCode: string;
    declare BusinessId: ForeignKey<Business['id']>;
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
