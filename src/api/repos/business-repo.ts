import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { Business, Employee, Address } from '../models';

/** Get Business using businessId */
const getBusinessById = async (businessId: string) => {
    await Business.sync();
    const business = await Business.findOne({
        where: { businessId: businessId },
        attributes: { exclude: ['id'] }
    });
    return {
        found: !!business,
        business: business
    };
};

/** Get the list of Employee(s) associated with that Business */
const getEmployeeList = async (id: string) => {
    await Business.sync();
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId '${id}'`, 'getEmployeeList', httpStatusCode.CONFLICT);
    }
    return {
        businessId: business.businessId,
        count: (await business.countEmployees()) || 0,
        employees: await business.getEmployees({
            attributes: { exclude: ['id'] }
        })
    };
};

/** SHOULD NOT USE */
const createSimpleBusiness = async (business: any) => {
    await Business.sync();
    return await Business.create({
        businessId: business.businessId,
        name: business.name
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createSimpleBusiness', httpStatusCode.INTERNAL_SERVER, true);
    });
};

/** Full set of creating a Business with a minimum of one Employee and an Address */
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
    const newEmployee = await newBusiness.createEmployee(employee).catch(async (err) => {
        console.log(err);
        await Business.destroy({ where: { businessId: newBusiness.businessId } });
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createBusinessEmployeeAddress', httpStatusCode.INTERNAL_SERVER, true);
    });
    await newBusiness.createAddress(address).catch(async (err) => {
        console.log(err);
        await Business.destroy({ where: { businessId: newBusiness.businessId } });
        await Employee.destroy({ where: { firebase_id: newEmployee.firebase_id } });
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'createBusinessEmployeeAddress', httpStatusCode.INTERNAL_SERVER, true);
    });
    return await getBusinessById(business.businessId);
};

/** Add a new Employee to the Business */
const addNewEmployee = async (id: string, employee: Employee) => {
    await Business.sync();
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId '${id}'`, 'addNewEmployee', httpStatusCode.CONFLICT);
    }
    const newEmployee = await business.createEmployee(employee);
    return {
        success: !!newEmployee,
        businessId: business.businessId,
        employee: await business.getEmployees({
            where: { email: newEmployee.email },
            attributes: { exclude: ['id'] }
        })
    };
};

/** Update Business */
const updateBusiness = async (identifier: any, update: any) => {
    await Business.sync();
    const result = await Business.update(update, { returning: ['businessId', 'name'], where: identifier }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'updateBusiness', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        success: !!result,
        business: result[1][0]
    };
};

export { getBusinessById, getEmployeeList, createSimpleBusiness, createBusinessWithEmployeeAddress, addNewEmployee, updateBusiness };
