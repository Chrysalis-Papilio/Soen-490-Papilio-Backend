import { object, string } from 'zod';
import { activitySchema } from './activity-schema';
import { addressSchema } from './address-schema';
import { employeeSchema } from './employee-schema';

const getBusinessById = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        })
    }).strict('Request URL contains an invalid key')
});

const getEmployeeList = getBusinessById;
// Same for now, hence borrowing

const getActivityList = getBusinessById;
// Same for now, hence borrowing

const createBusiness = object({
    body: object({
        // Business
        business: object({
            businessId: string({
                required_error: 'Business ID is required',
                invalid_type_error: 'Business ID should be of type string'
            }),
            name: string({
                required_error: 'Business Name is required',
                invalid_type_error: 'Business Name should be of type string'
            })
        }).strict('Business field contains an invalid key'),

        // Address
        address: addressSchema.strict('Address field contains an invalid key'),

        // Employee
        employee: employeeSchema.strict('Employee field contains an invalid key')
    })
});

const addNewEmployee = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        })
    }).strict('Request URL contains an invalid key'),
    body: object({
        employee: employeeSchema.strict('Employee field contains an invalid key')
    })
});

const addNewActivity = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        })
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Activity
        activity: activitySchema.strict('Activity field contains an invalid key'),

        // Address
        address: addressSchema.strict('Address field contains an invalid key')
    })
});

const updateBusiness = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        })
    }).strict('Request URL contains an invalid key'),
    body: object({
        update: object({
            name: string({
                required_error: 'Business Name is required',
                invalid_type_error: 'Business Name should be of type string'
            }).optional()
        }).strict('Update field contains an invalid key')
    })
});

export { getBusinessById, getEmployeeList, getActivityList, createBusiness, addNewEmployee, addNewActivity, updateBusiness };
