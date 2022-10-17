import {
    Association,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
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
import { Genre } from './Genre';
import { Label } from './Label';
import { ActivityReview } from './ActivityReview';

class Activity extends Model<InferAttributes<Activity, { omit: 'activityReviews' }>, InferCreationAttributes<Activity, { omit: 'activityReviews' }>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare startTime: Date | null;
    declare endTime: Date | null;

    declare activityReviews?: NonAttribute<ActivityReview[]>;

    declare getActivityReviews: HasManyGetAssociationsMixin<ActivityReview>;
    declare addActivityReview: HasManyAddAssociationMixin<ActivityReview, number>;
    declare addActivityReviews: HasManyAddAssociationsMixin<ActivityReview, number>;
    declare removeActivityReview: HasManyRemoveAssociationMixin<ActivityReview, number>;
    declare removeActivityReviews: HasManyRemoveAssociationsMixin<ActivityReview, number>;
    declare countActivityReviews: HasManyCountAssociationsMixin;
    declare createActivityReview: HasManyCreateAssociationMixin<ActivityReview, 'activity_id'>;
    declare hasActivityReview: HasManyHasAssociationMixin<ActivityReview, number>;

    declare addGenre: BelongsToManyAddAssociationMixin<Genre, number>;
    declare addGenres: BelongsToManyAddAssociationsMixin<Genre, number>;
    declare getGenres: BelongsToManyGetAssociationsMixin<Genre>;
    declare hasGenre: BelongsToManyHasAssociationMixin<Genre, number>;
    declare hasGenres: BelongsToManyHasAssociationsMixin<Genre, number>;
    declare removeGenre: BelongsToManyRemoveAssociationMixin<Genre, number>;
    declare removeGenres: BelongsToManyRemoveAssociationsMixin<Genre, number>;

    declare addLabel: BelongsToManyAddAssociationMixin<Label, number>;
    declare addLabels: BelongsToManyAddAssociationsMixin<Label, number>;
    declare getLabels: BelongsToManyGetAssociationsMixin<Label>;
    declare hasLabel: BelongsToManyHasAssociationMixin<Label, number>;
    declare hasLabels: BelongsToManyHasAssociationsMixin<Label, number>;
    declare removeLabel: BelongsToManyRemoveAssociationMixin<Label, number>;
    declare removeLabels: BelongsToManyRemoveAssociationsMixin<Label, number>;

    declare static associations: {
        activityReviews: Association<Activity, ActivityReview>;
    };
}

Activity.init(
    {
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
                        throw new Error('Title too short! 6+ characters');
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
                        throw new Error('Description too short! 15+ characters');
                    }
                }
            }
        },
        startTime: {
            type: DataTypes.DATE,
            defaultValue: new Date(Date.now()).toISOString()
        },
        endTime: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        validate: {
            endTimeAfterStartTime() {
                // TODO: needs to find a way to implement
            }
        }
    }
);

const Activity_Genres = sequelize.define(
    'Activity_Genres',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    { timestamps: false }
);

const Activity_Labels = sequelize.define(
    'Activity_Labels',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    { timestamps: false }
);

Activity.hasMany(ActivityReview, {
    as: 'activityReviews',
    foreignKey: 'activity_id',
    sourceKey: 'id'
});

Activity.belongsToMany(Genre, { through: Activity_Genres });

Genre.belongsToMany(Activity, { through: Activity_Genres });

Activity.belongsToMany(Label, { through: Activity_Labels });

Label.belongsToMany(Activity, { through: Activity_Labels });

export { Activity, Activity_Genres, Activity_Labels };
