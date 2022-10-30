import {Business} from "../models/Business";
import {BaseError} from "../../errors/base-error";
import {httpStatusCode} from "../../types/httpStatusCodes";
import {Employee} from "../models/Employee";
import {APIError} from "../../errors/api-error";

const getBusinessById = async (id: number) => {
    await Business.sync();
    return await Business.findOne({
        where: {id: id}
    }).catch((err) => {
        console.log(err);
        throw new APIError('Cannot find Business with id', 'getBusinessById', httpStatusCode.CONFLICT);
    });
}

const createBusiness = async (business: any) => {
    await Business.sync();
    return await Business.create({
        name: business.name,
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in the DB.', 'createBusiness', httpStatusCode.INTERNAL_SERVER, true);
    })
    // TODO: Add Address
    // TODO: Add Employee (optional)
}

const addEmployee = async (id: number, employee: Employee) => {
    await Business.sync();
    const business = await getBusinessById(id);
    if (!business) {
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'addEmployee', httpStatusCode.INTERNAL_SERVER, true);
    } else {
        return await business.addEmployee(employee);
    }
    // TODO: Better error handling
}

const updateBusiness = async (identifier: any, update: any) => {
    await Business.sync();
    const result = await Business.update(update, {where: identifier})
        .catch((err) => {
            console.log(err);
            // TODO: Better error handling
    });
    return result;
}

export {getBusinessById, createBusiness, addEmployee, updateBusiness};
