import { businessRepos } from '../repos';

const getBusinessById = async (id: number) => {
    return businessRepos.getBusinessById(id);
}

const createBusiness = async (business: any) => {
    return businessRepos.createBusiness(business);
}

const createBusinessWithEmployee = async (business: any, employee: any) => {
    const newBusiness = await createBusiness(business);
    return businessRepos.addEmployee(newBusiness.id, employee);
}

const updateBusiness = async (identifier: any, update: any) => {
    return businessRepos.updateBusiness(identifier, update);
}

export {getBusinessById, createBusiness, createBusinessWithEmployee, updateBusiness}
