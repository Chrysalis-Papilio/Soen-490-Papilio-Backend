import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../../config';

const Address = require('./Address');

class Business extends Model {
    declare id: number;
}

Business.init({
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
}, {
    sequelize
})

Business.belongsTo(Address, {
    as: 'BusinessAddress',
    foreignKey: 'address_id',
})

module.exports = Business;
