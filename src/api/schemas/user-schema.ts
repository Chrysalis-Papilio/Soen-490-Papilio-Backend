import { object, string } from 'zod';
import { requiredMessage, invalidMessage } from './util';
import { activitySchema } from './activity-schema';
// import { addressSchema } from './address-schema';

/** Attributes */

const firebase_id = string({
    required_error: requiredMessage('Firebase ID'),
    invalid_type_error: invalidMessage('Firebase ID', 'string')
});

const firstName = string({
    required_error: requiredMessage('First Name'),
    invalid_type_error: invalidMessage('First Name', 'string')
}).min(2, 'First Name too short!');

const lastName = string({
    required_error: requiredMessage('Last Name'),
    invalid_type_error: invalidMessage('Last Name', 'string')
}).min(2, 'Last name too short!');

const email = string({
    required_error: requiredMessage('Email'),
    invalid_type_error: invalidMessage('Email', 'string')
}).email('Invalid email');

const phone = string({
    required_error: requiredMessage('Phone'),
    invalid_type_error: invalidMessage('Phone', 'string')
}).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)');

const countryCode = string({
    required_error: requiredMessage('Country Code'),
    invalid_type_error: invalidMessage('Country Code', 'string')
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
        id: firebase_id
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

const addNewUserActivity = object({
    params: object({
        id: firebase_id
    }).strict('Request URL contains an invalid key'),
    body: object({
        // Activity
        activity: activitySchema.strict('Activity field contains an invalid key')
        // Address
        // address: addressSchema.strict('Address field contains an invalid key')
    })
});

export { firebase_id, firstName, lastName, email, phone, countryCode };
export { userSchema, createUserSchema, getAllUsers, getUserByEmailSchema, getUserById, updateUserSchema, addNewUserActivity };
