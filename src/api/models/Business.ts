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
import { Employee } from './Employee';
import { Activity } from './Activity';

class Business extends Model<InferAttributes<Business, { omit: 'employees' | 'activities' }>, InferCreationAttributes<Business, { omit: 'employees' | 'activities' }>> {
    declare id: CreationOptional<number>;
    declare businessId: string;
    declare name: string;
    declare address: string;
    declare email: string;

    declare employees?: NonAttribute<Employee[]>;
    declare activities?: NonAttribute<Activity[]>;

    declare getEmployees: HasManyGetAssociationsMixin<Employee>;
    declare removeEmployee: HasManyRemoveAssociationMixin<Employee, number>;
    declare countEmployees: HasManyCountAssociationsMixin;
    declare createEmployee: HasManyCreateAssociationMixin<Employee>;

    declare createActivity: HasManyCreateAssociationMixin<Activity>;
    declare countActivities: HasManyCountAssociationsMixin;
    declare removeActivity: HasManyRemoveAssociationMixin<Activity, number>;
    declare getActivities: HasManyGetAssociationsMixin<Activity>;

    declare static associations: {
        employees: Association<Business, Employee>;
        activities: Association<Business, Activity>;
    };
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        businessId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
        // TODO: More attributes for Business
    },
    {
        sequelize
    }
);

Business.hasMany(Employee, {
    as: 'employees',
    foreignKey: 'businessId',
    sourceKey: 'businessId'
});

Business.hasMany(Activity, {
    as: 'activities',
    foreignKey: 'businessId',
    sourceKey: 'businessId'
});

export { Business };
