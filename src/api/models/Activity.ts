import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../config';
import { Genre } from './Genre';
import { Label } from './Label';

class Activity extends Model<InferAttributes<Activity>, InferCreationAttributes<Activity>> {
    declare id: number;
    declare title: string;
    declare description: string;
    declare startTime: Date;
    declare endTime: Date | null;
}

Activity.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
            allowNull: false,
            defaultValue: new Date(0).toISOString()
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

Activity.belongsToMany(Genre, { through: 'Activity_Genres' });

Activity.belongsToMany(Label, { through: 'Activity_Labels' });

export { Activity };
