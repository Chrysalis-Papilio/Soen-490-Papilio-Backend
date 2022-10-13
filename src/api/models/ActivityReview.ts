import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
import { Activity } from './Activity';
import { User } from './User';

class ActivityReview extends Model<InferAttributes<ActivityReview>, InferCreationAttributes<ActivityReview>> {
    declare id: CreationOptional<number>;
    declare comment: string;
    declare rating: number;
    declare activity_id: ForeignKey<Activity['id']>;
    declare user_id: ForeignKey<User['id']>;
}

ActivityReview.init(
    {
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
    },
    { sequelize }
);

export { ActivityReview };
