import { CreationOptional, DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

const User = require('./User');

class Watchlist extends Model {
    declare id: CreationOptional<number>;
}

Watchlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        activity_ids: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        }
    },
    { sequelize }
);

Watchlist.belongsTo(User, {
    as: 'User',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

export { Watchlist };
