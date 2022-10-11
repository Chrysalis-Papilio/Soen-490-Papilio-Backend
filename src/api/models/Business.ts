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
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';
import { sequelize } from '../../config';
import { Address } from './Address';
import { Employee } from './Employee';

class Business extends Model<InferAttributes<Business, { omit: 'employees' }>, InferCreationAttributes<Business, { omit: 'employees' }>> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare employees?: NonAttribute<Employee[]>;

    declare getEmployees: HasManyGetAssociationsMixin<Employee>;
    declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
    declare addEmployees: HasManyAddAssociationsMixin<Employee, number>;
    declare removeEmployee: HasManyRemoveAssociationMixin<Employee, number>;
    declare removeEmployees: HasManyRemoveAssociationsMixin<Employee, number>;
    declare countEmployees: HasManyCountAssociationsMixin;
    declare createEmployee: HasManyCreateAssociationMixin<Employee, 'business_id'>;
    declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;

    declare addAddress: HasOneCreateAssociationMixin<Address>;
    declare getAddress: HasOneGetAssociationMixin<Address>;
    declare setAddress: HasOneSetAssociationMixin<Address, number>;

    declare static associations: {
        employees: Association<Business, Employee>;
    };
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
    sourceKey: 'id'
});

export { Business };
