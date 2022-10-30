import { businessRepo } from '../repos';

const getBusinessById = async (id: number) => {
    return businessRepo.getBusinessById(id);
};

const createBusiness = async (business: any) => {
    return businessRepo.createBusiness(business);
};

const createBusinessWithEmployee = async (business: any, employee: any) => {
    const newBusiness = await createBusiness(business);
    return businessRepo.addEmployee(newBusiness.id, employee);
};

const addEmployeeToBusiness = async (id: number, employee: any) => {
    return businessRepo.addEmployee(id, employee);
};

const addEmployeesToBusiness = async (id: number, employees: any[]) => {
    return businessRepo.addEmployees(id, employees);
};

const updateBusiness = async (identifier: any, update: any) => {
    return businessRepo.updateBusiness(identifier, update);
};

const getEmployeeList = async (id: number) => {
    return businessRepo.getEmployeeList(id);
};

export { getBusinessById, getEmployeeList, createBusiness, createBusinessWithEmployee, addEmployeeToBusiness, addEmployeesToBusiness, updateBusiness };
