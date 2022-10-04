import {DataTypes, Model} from "sequelize";
const database = require("../database");

class Watchlist extends Model {
    declare id: number;
}

Watchlist.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    activity_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
}, {
    sequelize: database
})
