import { any, boolean, number, object, string } from 'zod';

const employeeSchema = object({
    firebase_id: string({
        required_error: 'Firebase ID is required',
        invalid_type_error: 'Firebase ID should be of type string'
    }),
    firstName: string({
        required_error: 'First Name is required',
        invalid_type_error: 'First Name should be of type string'
    }).min(2, 'First Name too short!'),
    lastName: string({
        required_error: 'Last Name is required',
        invalid_type_error: 'Last Name should be of type string'
    }).min(2, 'Last Name too short!'),
    email: string({
        required_error: 'Email is required',
        invalid_type_error: 'Email should be of type string'
    }).email('Invalid email'),
    role: string({
        required_error: 'Role is required',
        invalid_type_error: 'Role should be of type string'
    }),
    root: boolean({
        required_error: 'Root is required',
        invalid_type_error: 'Root should be of type boolean'
    })
});

const addressSchema = object({
    // Required
    lineOne: string({
        required_error: 'Line One is required',
        invalid_type_error: 'Line One should be of type string'
    }).min(5, 'Line One too short!'),
    city: string({
        required_error: 'City is required',
        invalid_type_error: 'City should be of type string'
    }),
    state: string({
        required_error: 'State/Province is required',
        invalid_type_error: 'State/Province should be of type string'
    }).regex(new RegExp('^[A-Z]{2,4}')),
    country: string({
        required_error: 'Country is required',
        invalid_type_error: 'Country should be of type string'
    }),
    postalCode: string({
        required_error: 'Postal code is required',
        invalid_type_error: 'Postal Code should be of type string'
    }),

    // Optional
    mention: string({
        invalid_type_error: 'Mention should be of type string'
    }).optional(),
    lineTwo: string({
        invalid_type_error: 'Line Two should be of type string'
    }).optional()
});

const activitySchema = object({
    // Required
    title: string({
        required_error: 'Title is required',
        invalid_type_error: 'Title should be of type string'
    }),
    description: string({
        required_error: 'Description is required',
        invalid_type_error: 'Description should be of type string'
    }),
    location: string({
        required_error: 'Location is required',
        invalid_type_error: 'Location should be of type string'
    }),
    businessId: string({
        required_error: 'Business ID is required',
        invalid_type_error: 'Business ID should be of type string'
    }),

    // Optional
    costPerIndividual: number({
        invalid_type_error: 'Cost Per Individual should be of type number'
    }).optional(),
    costPerGroup: number({
        invalid_type_error: 'Cost Per Group should be of type number'
    }).optional(),
    groupSize: number({
        invalid_type_error: 'Group size should be of type number'
    }),
    image: string({
        invalid_type_error: 'Image URL should be of type string'
    }).optional(),
    startTime: any().optional(),
    endTime: any().optional()
});

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
        activity: activitySchema.strict('Activity field contains an invalid key')
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

export { getBusinessById, getEmployeeList, createBusiness, addNewEmployee, addNewActivity, updateBusiness };
