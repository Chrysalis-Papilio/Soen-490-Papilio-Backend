import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config';

class Label extends Model {
    declare id: number;
}

Label.init(
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

module.exports = Label;
