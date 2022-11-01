import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
import {Business} from "./Business";

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare id: CreationOptional<number>;
    declare firebase_id: string;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare role: string | null;
    declare business_id: ForeignKey<Business['businessId']>;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firebase_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        role: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize
    }
);

export { Employee };
