import { CreationOptional, DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class Genre extends Model {
    declare id: CreationOptional<number>;
}

Genre.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize
    }
);

export { Genre };
