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

const addEmployeeToBusiness = async (businessId: string, employee: any) => {
    return businessRepo.addEmployee(businessId, employee);
};

const addEmployeesToBusiness = async (businessId: string, employees: any[]) => {
    return businessRepo.addEmployees(businessId, employees);
};

const updateBusiness = async (identifier: any, update: any) => {
    return businessRepo.updateBusiness(identifier, update);
};

const getEmployeeList = async (businessId: string) => {
    return businessRepo.getEmployeeList(businessId);
};

export { getBusinessById, getEmployeeList, createSimpleBusiness, createBusiness, addEmployeeToBusiness, addEmployeesToBusiness, updateBusiness };
