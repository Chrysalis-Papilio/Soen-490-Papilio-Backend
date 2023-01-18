import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import sequelize from '../../config/sequelize';
import { ActivityReview } from './ActivityReview';
import { Activity } from './Activity';

class User extends Model<InferAttributes<User, { omit: 'userReviews' | 'activities' }>, InferCreationAttributes<User, { omit: 'userReviews' | 'activities' }>> {
    declare id: CreationOptional<number>;
    declare firebase_id: string;
    declare firstName: string;
    declare lastName: string;
    declare countryCode: number | null;
    declare phone: string | null;
    declare email: string;
    declare bio: string;

    declare userReviews?: NonAttribute<ActivityReview[]>;
    declare activities?: NonAttribute<Activity[]>;

    declare createActivity: HasManyCreateAssociationMixin<Activity>;
    declare countActivities: HasManyCountAssociationsMixin;
    declare removeActivity: HasManyRemoveAssociationMixin<Activity, number>;
    declare getActivities: HasManyGetAssociationsMixin<Activity>;

    declare getUserReviews: HasManyGetAssociationsMixin<ActivityReview>;
    declare removeUserReview: HasManyRemoveAssociationMixin<ActivityReview, number>;
    declare countUserReviews: HasManyCountAssociationsMixin;
    declare createUserReview: HasManyCreateAssociationMixin<ActivityReview>;

    declare static associations: {
        userReviews: Association<User, ActivityReview>;
        activities: Association<User, Activity>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firebase_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                validFirstName(value: String) {
                    if (value.length < 2) {
                        throw new Error('First name too short!');
                    }
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                validLastName(value: String) {
                    if (value.length < 2) {
                        throw new Error('Last name too short!');
                    }
                }
            }
        },
        countryCode: {
            type: DataTypes.STRING(5),
            defaultValue: '1',
            validate: {
                isNumeric: true
            }
        },
        phone: {
            type: DataTypes.STRING(10),
            validate: {
                isNumeric: true,
                len: [10, 10]
            },
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { sequelize }
);

User.hasMany(ActivityReview, {
    as: 'userReviews',
    foreignKey: 'userId',
    sourceKey: 'id'
});

User.hasMany(Activity, {
    as: 'activities',
    foreignKey: 'userId',
    sourceKey: 'firebase_id'
});

export { User };
