import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class Quiz extends Model<InferAttributes<Quiz>, InferCreationAttributes<Quiz>> {
    declare indoor: boolean;
    declare outdoor: boolean;
    declare genres: number[];
}

Quiz.init(
    {
        indoor: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        outdoor: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        genres: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }
    },
    { sequelize, timestamps: false }
);

export { Quiz };
