import { object, string } from 'zod';
import { addressSchema } from './address-schema';
import { activitySchema, activityId, description, title, startTime, endTime, costPerIndividual, costPerGroup, groupSize } from './activity-schema';
import { employeeSchema, employeeId, firstName, lastName, role } from './employee-schema';
import { invalidMessage, requiredMessage } from './util';

/** Attributes */

const businessId = string({
    required_error: requiredMessage('Business ID'),
    invalid_type_error: invalidMessage('Business ID', 'string')
});

const name = string({
    required_error: requiredMessage('Business Name'),
    invalid_type_error: invalidMessage('Business Name', 'string')
});

/** Schemas */

const getBusinessById = object({
    params: object({
        businessId: businessId
    }).strict('Request URL contains an invalid key')
});

const getEmployee = object({
    params: object({
        businessId: businessId,
        employeeId: employeeId
    }).strict('Request URL contains an invalid key')
});

const getActivity = object({
    params: object({
        businessId: businessId,
        activityId: activityId
    }).strict('Request URL contains an invalid key')
});

const getEmployeeList = getBusinessById;

const getActivityList = getBusinessById;

const createBusiness = object({
    body: object({
        // Business
        business: object({
            businessId: businessId,
            name: name
        }).strict('Business field contains an invalid key'),
        // Address
        address: addressSchema.strict('Address field contains an invalid key'),
        // Employee
        employee: employeeSchema.strict('Employee field contains an invalid key')
    })
});

const addNewEmployee = object({
    params: object({
        businessId: businessId
    }).strict('Request URL contains an invalid key'),
    body: object({
        employee: employeeSchema.strict('Employee field contains an invalid key')
    })
});

const addNewActivity = object({
    params: object({
        businessId: businessId
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
        businessId: businessId
    }).strict('Request URL contains an invalid key'),
    body: object({
        update: object({
            name: name.optional()
        }).strict('Update field contains an invalid key')
    })
});

const updateEmployee = object({
    params: object({
        businessId: businessId,
        employeeId: employeeId
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Optional
        firstName: firstName.optional(),
        lastName: lastName.optional(),
        role: role.optional()
    })
});

const updateActivity = object({
    params: object({
        businessId: businessId,
        activityId: activityId
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Optional
        title: title.optional(),
        description: description.optional(),
        startTime: startTime.optional(),
        endTime: endTime.optional(),
        costPerIndividual: costPerIndividual.optional(),
        costPerGroup: costPerGroup.optional(),
        groupSize: groupSize.optional()
    })
});

export { businessId, name };
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
