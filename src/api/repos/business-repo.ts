import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { Activity, Address, Business, Employee } from '../models';
import { createNewObjectCaughtError } from './error';

/** Get Business using businessId */
const getBusinessById = async (businessId: string) => {
    await Business.sync({ alter: true });
    await Address.sync({ alter: true });
    const business = await Business.findOne({
        where: { businessId: businessId },
        include: {
            model: Address,
            attributes: { exclude: ['id', 'ActivityId', 'BusinessId'] }
        },
        attributes: { exclude: ['id'] }
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in fetching the Business.', 'getBusinessById', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        found: !!business,
        business: business
    };
};

/** Get the list of Employee(s) associated with that Business */
const getEmployeeList = async (id: string) => {
    await Business.sync({ alter: true });
    await Employee.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId '${id}.`, 'getEmployeeList', httpStatusCode.CONFLICT);
    }
    return {
        businessId: business.businessId,
        count: (await business.countEmployees()) || 0,
        employees: await business.getEmployees({
            attributes: { exclude: ['id'] }
        })
    };
};

/** Get the list of Activity(ies) associated with that Business */
const getActivityList = async (id: string) => {
    await Business.sync({ alter: true });
    await Activity.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}.`, 'getActivityList', httpStatusCode.CONFLICT);
    }
    return {
        businessId: business.businessId,
        count: (await business.countActivities()) || 0,
        activities: await business.getActivities()
    };
};

/** SHOULD NOT USE */
const createSimpleBusiness = async (business: any) => {
    await Business.sync({ alter: true });
    return await Business.create({
        businessId: business.businessId,
        name: business.name
    }).catch((err) => createNewObjectCaughtError(err, 'createSimpleBusiness'));
};

/** Full set of creating a Business with a minimum of one Employee and an Address */
const createBusinessWithEmployeeAddress = async (business: Business, employee: Employee, address: Address) => {
    await Business.sync({ alter: true });
    await Employee.sync({ alter: true });
    await Address.sync({ alter: true });
    const newBusiness = await Business.create({
        businessId: business.businessId,
        name: business.name
    }).catch((err) => createNewObjectCaughtError(err, 'createBusinessWithEmployeeAddress', 'There has been an error in creating the Business.'));
    await newBusiness.createEmployee(employee).catch(async (err) => {
        createNewObjectCaughtError(err, 'createBusinessWithEmployeeAddress', 'There has been an error in creating the Employee.');
        await Business.destroy({ where: { businessId: business.businessId } });
    });
    await newBusiness.createAddress(address).catch(async (err) => {
        createNewObjectCaughtError(err, 'createBusinessWithEmployeeAddress', 'There has been an error in creating the Address.');
        await Business.destroy({ where: { businessId: business.businessId } });
        await Employee.destroy({ where: { firebase_id: employee.firebase_id } });
    });
    return await getBusinessById(business.businessId);
};

/** Add a new Employee to the Business */
const addNewEmployee = async (id: string, employee: Employee) => {
    await Business.sync({ alter: true });
    await Employee.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId '${id}'`, 'addNewEmployee', httpStatusCode.CONFLICT);
    }
    const newEmployee = await business.createEmployee(employee).catch((err) => createNewObjectCaughtError(err, 'addNewEmployee', 'There has been an error in creating a new Employee'));
    return {
        success: !!newEmployee,
        businessId: business.businessId,
        employee: await business.getEmployees({
            where: { email: newEmployee.email },
            attributes: { exclude: ['id'] }
        })
    };
};

/** Add a new Activity to the Business */
const addNewActivity = async (id: string, activity: Activity, address: Address) => {
    await Business.sync({ alter: true });
    await Activity.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}`, 'addNewActivity', httpStatusCode.CONFLICT);
    }
    const newActivity = await business
        .createActivity(activity, { returning: true })
        .catch((err) => createNewObjectCaughtError(err, 'addNewActivity', 'There has been an error in creating a new Activity'));
    await newActivity.createAddress(address).catch(async (err) => {
        createNewObjectCaughtError(err, 'addNewActivity', 'There has been an error in creating a new Address');
        await Activity.destroy({ where: { id: newActivity.id } });
    });
    return {
        success: !!newActivity,
        businessId: business.businessId,
        activity: newActivity
    };
};

/** Remove Activity with id 'activityId' */
const removeActivity = async (id: string, activityId: number) => {
    await Business.sync({ alter: true });
    await Employee.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}`, 'removeActivity', httpStatusCode.CONFLICT);
    }
    const preCount = await business.countActivities();
    const activity = await Activity.findOne({ where: { id: activityId } });
    if (!activity) {
        throw new APIError(`Cannot find Activity with id ${activityId}`, 'removeActivity', httpStatusCode.CONFLICT);
    }
    await business.removeActivity(activity);
    return {
        success: !(preCount === (await business.countActivities()))
    };
};

/** Remove Employee with firebase_id 'employeeId' */
const removeEmployee = async (id: string, employeeId: string) => {
    await Business.sync({ alter: true });
    await Employee.sync({ alter: true });
    const business = await (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}`, 'removeEmployee', httpStatusCode.CONFLICT);
    }
    const preCount = await business.countEmployees();
    const employee = await Employee.findOne({ where: { firebase_id: employeeId } });
    if (!employee) {
        throw new APIError(`Cannot find Employee with firebase_id ${employeeId}`, 'removeEmployee', httpStatusCode.CONFLICT);
    }
    await business.removeEmployee(employee);
    return {
        success: !(preCount === (await business.countEmployees()))
    };
};

/** Update Business */
const updateBusiness = async (identifier: any, update: any) => {
    await Business.sync({ alter: true });
    const result = await Business.update(update, {
        returning: ['businessId', 'name'],
        where: identifier
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'updateBusiness', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        success: !!result,
        business: result[1][0]
    };
};

export { getBusinessById, getEmployeeList, getActivityList, createSimpleBusiness, createBusinessWithEmployeeAddress, addNewEmployee, addNewActivity, removeEmployee, removeActivity, updateBusiness };
