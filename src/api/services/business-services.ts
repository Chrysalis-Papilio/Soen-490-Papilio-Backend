import { businessRepo } from '../repos';

const getBusinessById = async (businessId: string) => {
    return businessRepo.getBusinessById(businessId);
};

const createBusiness = async (business: any) => {
    return businessRepo.createBusiness(business);
};

const createBusinessWithEmployee = async (business: any, employee: any) => {
    const newBusiness = await createBusiness(business);
    return businessRepo.addEmployee(newBusiness.businessId, employee);
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

export { getBusinessById, getEmployeeList, createBusiness, createBusinessWithEmployee, addEmployeeToBusiness, addEmployeesToBusiness, updateBusiness };
