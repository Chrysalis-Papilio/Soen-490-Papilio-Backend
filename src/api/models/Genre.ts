import { CreationOptional, DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class Genre extends Model {
    declare id: CreationOptional<number>;
    declare name: string;
    declare url: string | null;
    declare category: string | null;
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
        },
        url: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize
    }
);

export { Genre };
