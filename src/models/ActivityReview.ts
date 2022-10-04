import {DataTypes, Model} from "sequelize";
const Activity = require("./Activity");
const User = require("./User");
const database = require("../database");

class ActivityReview extends Model {
    declare id: number;
}

ActivityReview.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 10
        },
        allowNull: false
    }
}, {
    sequelize: database
})

ActivityReview.belongsTo(Activity, {
    as: 'Activity',
    foreignKey: 'activity_id',
    onDelete: 'CASCADE'
});
ActivityReview.belongsTo(User, {
    as: 'User',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
