import { businessRepos } from '../repos';

const getBusinessById = async (id: number) => {
    return businessRepos.getBusinessById(id);
};

const createBusiness = async (business: any) => {
    return businessRepos.createBusiness(business);
};

const createBusinessWithEmployee = async (business: any, employee: any) => {
    const newBusiness = await createBusiness(business);
    return businessRepos.addEmployee(newBusiness.id, employee);
};

const addEmployeeToBusiness = async (id: number, employee: any) => {
    return businessRepos.addEmployee(id, employee);
};

const addEmployeesToBusiness = async (id: number, employees: any[]) => {
    return businessRepos.addEmployees(id, employees);
};

const updateBusiness = async (identifier: any, update: any) => {
    return businessRepos.updateBusiness(identifier, update);
};

const getEmployeeList = async (id: number) => {
    return businessRepos.getEmployeeList(id);
};

export { getBusinessById, getEmployeeList, createBusiness, createBusinessWithEmployee, addEmployeeToBusiness, addEmployeesToBusiness, updateBusiness };
