import { businessRepo } from '../repos';

const getBusinessById = async (businessId: string) => {
    return businessRepo.getBusinessById(businessId);
};

const createSimpleBusiness = async (business: any) => {
    return businessRepo.createSimpleBusiness(business);
};

const createBusiness = async (business: any, employee: any, address: any) => {
    await businessRepo.createBusinessWithEmployeeAddress(business, employee, address);
    return getBusinessById(business.businessId);
};

const updateBusiness = async (identifier: any, update: any) => {
    return businessRepo.updateBusiness(identifier, update);
};

const getEmployeeList = async (businessId: string) => {
    return businessRepo.getEmployeeList(businessId);
};

const getActivityList = async (businessId: string) => {
    return businessRepo.getActivityList(businessId);
};

const addNewEmployee = async (businessId: string, employee: any) => {
    return businessRepo.addNewEmployee(businessId, employee);
};

const addNewActivity = async (businessId: string, activity: any, address: any) => {
    return businessRepo.addNewActivity(businessId, activity, address);
};

const removeEmployee = async (businessId: string, employeeId: string) => {
    return businessRepo.removeEmployee(businessId, employeeId);
};

const removeActivity = async (businessId: string, activityId: number) => {
    return businessRepo.removeActivity(businessId, activityId);
};

const updateEmployee = async (businessId: string, employeeId: string, update: any) => {
    return businessRepo.updateEmployee(businessId, employeeId, update);
};

const updateActivity = async (businessId: string, activityId: number, update: any) => {
    return businessRepo.updateActivity(businessId, activityId, update);
};

export {
    getBusinessById,
    getEmployeeList,
    getActivityList,
    createSimpleBusiness,
    createBusiness,
    addNewEmployee,
    addNewActivity,
    removeEmployee,
    removeActivity,
    updateBusiness,
    updateEmployee,
    updateActivity
};
