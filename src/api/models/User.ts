import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import sequelize from '../../config/sequelize';
import { ActivityReview } from './ActivityReview';

class User extends Model<InferAttributes<User, { omit: 'userReviews' }>, InferCreationAttributes<User, { omit: 'userReviews' }>> {
    declare id: CreationOptional<number>;
    declare firebase_id: string;
    declare firstName: string;
    declare lastName: string;
    declare countryCode: number | null;
    declare phone: string;
    declare email: string;

    declare userReviews?: NonAttribute<ActivityReview[]>;

    declare getUserReviews: HasManyGetAssociationsMixin<ActivityReview>;
    declare addUserReview: HasManyAddAssociationMixin<ActivityReview, number>;
    declare addUserReviews: HasManyAddAssociationsMixin<ActivityReview, number>;
    declare removeUserReview: HasManyRemoveAssociationMixin<ActivityReview, number>;
    declare removeUserReviews: HasManyRemoveAssociationsMixin<ActivityReview, number>;
    declare countUserReviews: HasManyCountAssociationsMixin;
    declare createUserReview: HasManyCreateAssociationMixin<ActivityReview, 'user_id'>;
    declare hasUserReview: HasManyHasAssociationMixin<ActivityReview, number>;

    declare static associations: {
        userReviews: Association<User, ActivityReview>;
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
        }
    },
    { sequelize }
);

User.hasMany(ActivityReview, {
    as: 'userReviews',
    foreignKey: 'user_id',
    sourceKey: 'id'
});

export { User };
