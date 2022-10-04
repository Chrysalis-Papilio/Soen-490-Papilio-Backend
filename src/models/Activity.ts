import {DataTypes, Model} from "sequelize";
const database = require("../database");

class Activity extends Model {
    declare id: number;
}

Activity.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            meaningfulTitle(value: String) {
                if (value.length < 6) {
                    throw new Error("Title too short! 6+ characters");
                }
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            meaningfulDescription(value: String) {
                if (value.length < 15) {
                    throw new Error("Description too short! 15+ characters");
                }
            }
        }
    },
    genre_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    label_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(0).toISOString()
    },
    endTime: {
        type: DataTypes.DATE,
    }
}, {
    sequelize: database,
    validate: {
        endTimeAfterStartTime() {
            // TODO: needs to find a way to implement
        }
    }
})

module.exports = Activity;
