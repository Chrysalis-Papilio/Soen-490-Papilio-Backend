import { businessRepo } from '../repos';

const getBusinessById = async (businessId: string) => {
    return businessRepo.getBusinessById(businessId);
};

const createSimpleBusiness = async (business: any) => {
    return businessRepo.createSimpleBusiness(business);
};

const createBusinessWithEmployee = async (business: any, employee: any) => {
    const newBusiness = await createSimpleBusiness(business);
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

export { getBusinessById, getEmployeeList, createSimpleBusiness, createBusinessWithEmployee, addEmployeeToBusiness, addEmployeesToBusiness, updateBusiness };
