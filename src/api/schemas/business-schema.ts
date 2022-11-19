import { any, number, object, string } from 'zod';
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

const getEmployee = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        }),
        employeeId: string({
            required_error: 'Employee Firebase ID is required',
            invalid_type_error: 'Employee Firebase ID should be of type string'
        })
    }).strict('Request URL contains an invalid key')
});

const getActivity = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        }),
        activityId: string({
            required_error: 'Activity ID is required',
            invalid_type_error: 'Activity ID should be of type string'
        })
    }).strict('Request URL contains an invalid key')
});

const getEmployeeList = getBusinessById;

const getActivityList = getBusinessById;

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

const removeEmployee = getEmployee;

const removeActivity = getActivity;

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

const updateEmployee = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        }),
        employeeId: string({
            required_error: 'Employee Firebase ID is required',
            invalid_type_error: 'Employee Firebase ID should be of type string'
        })
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Optional
        firstName: string({ invalid_type_error: 'First Name should be of type string' }).optional(),
        lastName: string({ invalid_type_error: 'Last Name should be of type string' }).optional(),
        role: string({ invalid_type_error: 'Role should be of type string' }).optional()
    })
});

const updateActivity = object({
    params: object({
        businessId: string({
            required_error: 'Business ID is required',
            invalid_type_error: 'Business ID should be of type string'
        }),
        activityId: string({
            required_error: 'Activity ID is required',
            invalid_type_error: 'Activity ID should be of type string'
        })
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Optional
        title: string({ invalid_type_error: 'Title should be of type string' }).optional(),
        description: string({ invalid_type_error: 'Description should be of type string' }).optional(),
        startTime: any().optional(),
        endTime: any().optional(),
        costPerIndividual: number({ invalid_type_error: 'Cost Per Individual should be of type number' }).optional(),
        costPerGroup: number({ invalid_type_error: 'Cost Per Group should be of type number' }).optional(),
        groupSize: number({ invalid_type_error: 'Group Size should be of type number' }).optional()
    })
});

export {
    getBusinessById,
    getEmployee,
    getActivity,
    getEmployeeList,
    getActivityList,
    createBusiness,
    addNewEmployee,
    addNewActivity,
    removeEmployee,
    removeActivity,
    updateEmployee,
    updateActivity,
    updateBusiness
};
