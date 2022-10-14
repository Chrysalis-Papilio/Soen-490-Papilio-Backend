import { object, string} from 'zod';

const createUserSchema = object({
    body: object({
        //  Required
        firebase_id: string({
            required_error: 'Firebase ID is required',
            invalid_type_error: 'Firebase ID should be of type string'
        }).min(1, 'Firebase ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid firebase ID (Positive integer)'),
        firstName: string({
            required_error: 'Firstname is required',
            invalid_type_error: 'Firstname should be of type string'
        }).min(2, 'First name too short!'),
        lastName: string({
            required_error: 'Lastname is required',
            invalid_type_error: 'Lastname should be of type string'
        }).min(2, 'Last name too short!'),
        email: string({
            required_error: 'Email is required',
            invalid_type_error: 'Email should be of type string'
        }).email('Invalid email'),
        
        //  Optional
        id: string({
            required_error: 'User ID is required',
            invalid_type_error: 'User ID should be of type string'
        }).min(1, 'ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid ID (Positive integer)').optional(),
        phone: string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone should be of type string',
        }).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)').optional(),
        countryCode: string({
            required_error: 'Country Code is required',
            invalid_type_error: 'Country Code should be of type string'
        }).regex(new RegExp('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$'), 'Invalid country code (0-999)').optional(),
    }).strict('Request contains an invalid key')
});

const getUserByEmailSchema = object({
    body: object({
        //  Required
        email: string({
            required_error: 'Email is required',
            invalid_type_error: 'Email should be of type string'
        }).email('Invalid email'),
        
        //  Optional
        id: string({
            required_error: 'User ID is required',
            invalid_type_error: 'User ID should be of type string'
        }).min(1, 'ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid ID (Positive integer)').optional(),
        firebase_id: string({
            required_error: 'Firebase ID is required',
            invalid_type_error: 'Firebase ID should be of type string'
        }).min(1, 'Firebase ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid firebase ID (Positive integer)').optional(),
        firstName: string({
            required_error: 'Firstname is required',
            invalid_type_error: 'Firstname should be of type string'
        }).min(2, 'First name too short!').optional(),
        lastName: string({
            required_error: 'Lastname is required',
            invalid_type_error: 'Lastname should be of type string'
        }).min(2, 'Last name too short!').optional(),
        phone: string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone should be of type string',
        }).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)').optional(),
        countryCode: string({
            required_error: 'Country Code is required',
            invalid_type_error: 'Country Code should be of type string'
        }).regex(new RegExp('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$'), 'Invalid country code (0-999)').optional(),
    }).strict('Request contains an invalid key')
});

const updateUserSchema = object({
    body: object({
        //  Identifier attribute
        identifier: object({
            id: string({
                required_error: 'User ID is required',
                invalid_type_error: 'User ID should be of type string'
            }).min(1, 'ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid ID (Positive integer)'),
        }).strict(),
        //  Update attribute
        update: object({
            firebase_id: string({
                required_error: 'Firebase ID is required',
                invalid_type_error: 'Firebase ID should be of type string'
            }).min(1, 'Firebase ID is too short!').regex(new RegExp('^[0-9]*$'), 'Invalid firebase ID (Positive integer)').optional(),
            firstName: string({
                required_error: 'Firstname is required',
                invalid_type_error: 'Firstname should be of type string'
            }).min(2, 'First name too short!').optional(),
            lastName: string({
                required_error: 'Lastname is required',
                invalid_type_error: 'Lastname should be of type string'
            }).min(2, 'Last name too short!').optional(),
            email: string({
                required_error: 'Email is required',
                invalid_type_error: 'Email should be of type string'
            }).email('Invalid email').optional(),
            phone: string({
                required_error: 'Phone number is required',
                invalid_type_error: 'Phone should be of type string',
            }).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)').optional(),
            countryCode: string({
                required_error: 'Country Code is required',
                invalid_type_error: 'Country Code should be of type string'
            }).regex(new RegExp('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$'), 'Invalid country code (0-999)').optional(),
        }).strict('Request contains an invalid key'
        ).refine(({firebase_id, firstName, lastName, email, phone, countryCode}) => 
                firebase_id !== undefined || firstName !== undefined || lastName !== undefined || email !== undefined || phone !== undefined || countryCode !== undefined,
            { message: 'One of the fields must be defined' }
        ).refine((update) => {
            var count = 0;
            if (update.firebase_id !== undefined)
                count++;
            if (update.firstName !== undefined)
                count++;
            if (update.lastName !== undefined)
                count++;
            if (update.email !== undefined)
                count++;
            if (update.phone !== undefined)
                count++;
            if (update.countryCode !== undefined)
                count++;
        return count === 1;
    },
    { message: 'Exactly one update field must be defined' })
    }).refine((identifier) => 
        identifier !== undefined,
        { message: 'Missing identifier' }
    ),
})
    
export { createUserSchema, getUserByEmailSchema, updateUserSchema };