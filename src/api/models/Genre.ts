import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

class Genre extends Model {
    declare id: number;
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

module.exports = Genre;
