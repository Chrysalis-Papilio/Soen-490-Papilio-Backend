import { APIError } from '../../errors/api-error';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { Activity, Business, Employee } from '../models';
import { createNewObjectCaughtError } from './error';

/** Get Business using businessId */
const getBusinessById = async (businessId: string, exclude = ['id']) => {
    await Business.sync();
    const business = await Business.findOne({
        where: { businessId: businessId },
        attributes: { exclude }
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error.', 'There has been an error in fetching the Business.', 'getBusinessById', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        found: !!business,
        business: business
    };
};

/** Get the single Employee that is associated with that Business */
const getEmployee = async (businessId: string, employeeId: string) => {
    await Business.sync();
    await Employee.sync();
    const business = (await getBusinessById(businessId)).business;

    if (!business) {
        throw new APIError(`Cannot find Business with businessId '${businessId}.`, 'getEmployee', httpStatusCode.CONFLICT);
    }

    return {
        employee: (
            await business.getEmployees({
                attributes: { exclude: ['createdAt', 'updatedAt', 'root'] },
                where: { firebase_id: employeeId },
                limit: 1
            })
        )[0]
    };
};

/** Get the list of Employee(s) associated with that Business */
const getEmployeeList = async (id: string) => {
    await Business.sync();
    await Employee.sync();
    const business = (await getBusinessById(id)).business;
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
    await Business.sync();
    await Activity.sync();
    const business = (await getBusinessById(id)).business;
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
    await Business.sync();
    return await Business.create({
        businessId: business.businessId,
        name: business.name,
        address: business.address,
        email: business.email,
        adTier: 0
    }).catch((err) => createNewObjectCaughtError(err, 'createSimpleBusiness'));
};

/** Full set of creating a Business with a minimum of one Employee and an Address */
const createBusinessWithEmployeeAddress = async (business: Business, employee: Employee) => {
    await Business.sync();
    await Employee.sync();
    const newBusiness = await Business.create({
        businessId: business.businessId,
        name: business.name,
        address: business.address,
        email: business.email,
        adTier: 0
    }).catch((err) => createNewObjectCaughtError(err, 'createBusinessWithEmployeeAddress', 'There has been an error in creating the Business.'));
    await newBusiness.createEmployee(employee).catch(async (err) => {
        createNewObjectCaughtError(err, 'createBusinessWithEmployeeAddress', 'There has been an error in creating the Employee.');
        await Business.destroy({ where: { businessId: business.businessId } });
    });
    return await getBusinessById(business.businessId);
};

/** Add a new Employee to the Business */
const addNewEmployee = async (id: string, employee: Employee) => {
    await Business.sync();
    await Employee.sync();
    const business = (await getBusinessById(id)).business;
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
const addNewActivity = async (id: string, activity: Activity) => {
    await Business.sync();
    await Activity.sync();
    const business = (await getBusinessById(id)).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}`, 'addNewActivity', httpStatusCode.CONFLICT);
    }
    const newActivity = await business
        .createActivity(activity, { returning: true })
        .catch((err) => createNewObjectCaughtError(err, 'addNewActivity', 'There has been an error in creating a new Activity'));
    return {
        success: !!newActivity,
        businessId: business.businessId,
        activity: newActivity
    };
};

/** Remove Activity with id 'activityId' */
/** Sequelize will nullify businessId attribute in Activity, will not remove the row */
const removeActivity = async (id: string, activityId: number) => {
    await Business.sync();
    await Employee.sync();
    const business = (await getBusinessById(id)).business;
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
/** Sequelize will nullify businessId attribute in Employee, will not remove the row */
const removeEmployee = async (id: string, employeeId: string) => {
    await Business.sync();
    await Employee.sync();
    const business = (await getBusinessById(id)).business;
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

const removeBusiness = async (id: string) => {
    await Business.sync();
    await Employee.sync();
    await Activity.sync();

    const business = (await getBusinessById(id, [])).business;
    if (!business) {
        throw new APIError(`Cannot find Business with businessId ${id}`, 'removeBusiness', httpStatusCode.CONFLICT);
    }

    await business.removeEmployees();
    await business.removeActivities();
    await business.destroy();

    return {
        success: !(await getBusinessById(id)).business
    };
};

/** Update Business */
const updateBusiness = async (identifier: any, update: any) => {
    await Business.sync();
    const result = await Business.update(update, {
        returning: ['businessId', 'name', 'address', 'email', 'adTier'],
        where: identifier
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in the DB', 'updateBusiness', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        success: !!result[1][0],
        business: result[1][0]
    };
};

/** Update Employee of Business */
const updateEmployee = async (id: string, employeeId: string, update: any) => {
    await Business.sync();
    await Employee.sync();
    const employee = (await getEmployee(id, employeeId)).employee;
    const up = await employee.update(update).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in updating the Employee', 'updateEmployee', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        success: !!up
    };
};

// TODO: here (future task)
// @ts-ignore
const updateActivity = async (id: string, activityId: number, update: any) => {
    await Business.sync();
    await Activity.sync();
};

export {
    getBusinessById,
    getEmployeeList,
    getEmployee,
    getActivityList,
    createSimpleBusiness,
    createBusinessWithEmployeeAddress,
    addNewEmployee,
    addNewActivity,
    removeEmployee,
    removeActivity,
    removeBusiness,
    updateBusiness,
    updateEmployee,
    updateActivity
};
