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

export { getBusinessById, getEmployeeList, getActivityList, createSimpleBusiness, createBusiness, addNewEmployee, addNewActivity, updateBusiness };
