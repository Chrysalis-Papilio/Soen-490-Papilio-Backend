import { Business } from '../models/Business';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { Employee } from '../models/Employee';
import { APIError } from '../../errors/api-error';
import { Address } from '../models/Address';

const getBusinessById = async (businessId: string) => {
    await Business.sync();
    return await Business.findOne({
        where: { businessId: businessId }
    }).catch((err) => {
        console.log(err);
        throw new APIError('Cannot find Business with businessId', 'getBusinessById', httpStatusCode.CONFLICT);
    });
};

const getEmployeeList = async (id: string) => {
    await Business.sync();
    const business = await getBusinessById(id);
    if (!business) {
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'addEmployee', httpStatusCode.INTERNAL_SERVER, true);
    } else {
        return business.getEmployees();
    }
    // TODO: Better error handling
};

const createSimpleBusiness = async (business: any) => {
    await Business.sync();
    return await Business.create({
        businessId: business.businessId,
        name: business.name
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createBusiness', httpStatusCode.INTERNAL_SERVER, true);
    });
    // TODO: Better error handling
};

const createBusinessWithEmployeeAddress = async (business: Business, employee: Employee, address: Address) => {
    await Business.sync();
    await Employee.sync();
    await Address.sync();
    const newBusiness = await Business.create({
        businessId: business.businessId,
        name: business.name
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createBusinessEmployeeAddress', httpStatusCode.INTERNAL_SERVER, true);
    });
    await newBusiness.createEmployee(employee).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createBusinessEmployeeAddress', httpStatusCode.INTERNAL_SERVER, true);
    });
    await newBusiness.createAddress(address).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'createBusinessEmployeeAddress', httpStatusCode.INTERNAL_SERVER, true);
    });
    return newBusiness;
    // TODO: Better error handling
    // TODO: If createEmployee and/or createAddress fails, revert everything
};

const addEmployee = async (id: string, employee: Employee) => {
    await Business.sync();
    const business = await getBusinessById(id);
    if (!business) {
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'addEmployee', httpStatusCode.INTERNAL_SERVER, true);
    } else {
        return await business.addEmployee(employee);
    }
    // TODO: Better error handling
};

const addEmployees = async (id: string, employees: Employee[]) => {
    await Business.sync();
    const business = await getBusinessById(id);
    if (!business) {
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'addEmployee', httpStatusCode.INTERNAL_SERVER, true);
    } else {
        return await business.addEmployees(employees);
    }
    // TODO: Better error handling
};

const setAddress = async (id: string, address: Address) => {
    await Business.sync();
    await Address.sync();
    const business = await getBusinessById(id);
    if (!business) {
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'addEmployee', httpStatusCode.INTERNAL_SERVER, true);
    } else {
        return await business.setAddress(address);
    }
    // TODO: Better error handling
};

const updateBusiness = async (identifier: any, update: any) => {
    await Business.sync();
    return await Business.update(update, { where: identifier }).catch((err) => {
        console.log(err);
        // TODO: Better error handling
    });
};

/**
 * TODO: removeEmployee
 * TODO: removeEmployees
 * TODO: updateAddress
 * TODO: removeAddress
 * TODO: ...more
 */

export { getBusinessById, getEmployeeList, createSimpleBusiness, createBusinessWithEmployeeAddress, addEmployee, addEmployees, setAddress, updateBusiness };
