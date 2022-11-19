import { object, string } from 'zod';

/** Attributes */

const id = string({
    required_error: 'Firebase ID is required',
    invalid_type_error: 'Firebase ID should be of type string'
});

const firebase_id = string({
    required_error: 'Firebase ID is required',
    invalid_type_error: 'Firebase ID should be of type string'
});

const firstName = string({
    required_error: 'Firstname is required',
    invalid_type_error: 'Firstname should be of type string'
}).min(2, 'First name too short!');

const lastName = string({
    required_error: 'Lastname is required',
    invalid_type_error: 'Lastname should be of type string'
}).min(2, 'Last name too short!');

const email = string({
    required_error: 'Email is required',
    invalid_type_error: 'Email should be of type string'
}).email('Invalid email');

const phone = string({
    invalid_type_error: 'Phone should be of type string'
}).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)');

const countryCode = string({
    invalid_type_error: 'Country Code should be of type string'
}).regex(new RegExp('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$'), 'Invalid country code (0-999)');

/** Schemas */

const userSchema = object({
    //  Required
    firebase_id: firebase_id,
    firstName: firstName,
    lastName: lastName,
    email: email,

    //  Optional
    phone: phone.optional(),
    countryCode: countryCode.optional()
});

const createUserSchema = object({
    body: object({
        user: userSchema.strict('Request contains an invalid key')
    })
});

const getAllUsers = object({});

const getUserByEmailSchema = object({
    params: object({
        //  Required
        email: email
    }).strict('Request contains an invalid key')
});

const getUserById = object({
    params: object({
        // Required
        id: id
    }).strict('Request contains an invalid key')
});

const updateUserSchema = object({
    body: object({
        //  Identifier attribute
        identifier: object({
            firebase_id: firebase_id
        }).strict('Identifier field contains an invalid key'),

        //  Update attribute
        update: object({
            firstName: firstName.optional(),
            lastName: lastName.optional(),
            email: email.optional(),
            phone: phone.optional(),
            countryCode: countryCode.optional()
        })
            .strict('Update field contains an invalid key')
            .refine(
                ({ firstName, lastName, email, phone, countryCode }) => firstName !== undefined || lastName !== undefined || email !== undefined || phone !== undefined || countryCode !== undefined,
                { message: 'One of the fields must be defined' }
            )
    })
});

export { id, firebase_id, firstName, lastName, email, phone, countryCode };
export { userSchema, createUserSchema, getAllUsers, getUserByEmailSchema, getUserById, updateUserSchema };
