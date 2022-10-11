import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../config';
import { Address } from './Address';

class Business extends Model<InferAttributes<Business>, InferCreationAttributes<Business>> {
    declare id: CreationOptional<number>;
    declare name: string;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
        // TODO: More attributes for Business
    },
    {
        sequelize
    }
);

Business.hasOne(Address);
Address.belongsTo(Business);

export { Business };
