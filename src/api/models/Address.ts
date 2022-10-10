import {DataTypes, Model} from "sequelize";
import {sequelize} from "../../config";

const Business = require('./Business');

class Address extends Model {
    declare id: number;
}

Address.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mention: {
        type: DataTypes.STRING,
        allowNull: true,
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
        allowNull: false
    }
}, {
    sequelize
})

Address.belongsTo(Business, {
    as: 'Business',
    foreignKey: 'business_id',
    onDelete: 'CASCADE'
});

module.exports = Address;
