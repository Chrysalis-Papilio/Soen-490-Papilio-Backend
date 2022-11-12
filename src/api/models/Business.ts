import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import sequelize from '../../config/sequelize';
import { Address } from './Address';
import { Employee } from './Employee';
import { Activity } from './Activity';

class Business extends Model<InferAttributes<Business, { omit: 'employees' | 'activities' }>, InferCreationAttributes<Business, { omit: 'employees' | 'activities' }>> {
    declare id: CreationOptional<number>;
    declare businessId: string;
    declare name: string;

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

    declare createAddress: HasOneCreateAssociationMixin<Address>;
    declare getAddress: HasOneGetAssociationMixin<Address>;
    declare setAddress: HasOneSetAssociationMixin<Address, number>;

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
        }
        // TODO: More attributes for Business
    },
    {
        sequelize
    }
);

Business.hasOne(Address);
Address.belongsTo(Business);

Business.hasMany(Employee, {
    as: 'employees',
    foreignKey: 'business_id',
    sourceKey: 'businessId'
});

Business.hasMany(Activity, {
    as: 'activities',
    foreignKey: 'business_id',
    sourceKey: 'businessId'
});

export { Business };
