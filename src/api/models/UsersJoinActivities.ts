import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { User, Activity } from './index';
import sequelize from '../../config/sequelize';

class UsersJoinActivities extends Model<InferAttributes<UsersJoinActivities>, InferCreationAttributes<UsersJoinActivities>> {
    declare id: CreationOptional<number>;
    declare userId: string; // firebase_id foreign key (User)
    declare activityId: number; // id foreign key (Activity)
}

UsersJoinActivities.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'activityId']
            }
        ]
    }
);

User.hasMany(UsersJoinActivities, {
    as: 'joinedActivities',
    foreignKey: 'userId',
    sourceKey: 'firebase_id'
});
UsersJoinActivities.belongsTo(User, {
    as: 'users',
    foreignKey: 'userId',
    targetKey: 'firebase_id'
});

Activity.hasMany(UsersJoinActivities, {
    as: 'joinedUsers',
    foreignKey: 'activityId',
    sourceKey: 'id'
});
UsersJoinActivities.belongsTo(Activity, {
    as: 'activities',
    foreignKey: 'activityId',
    targetKey: 'id'
});

export { UsersJoinActivities };
