import {object, string} from 'zod';

const createUserSchema = object ({
    body: object({
        firstName: string({
            required_error: 'Firstname is required.'
        }).min(2, 'First name too short!'),
        lastName: string({
            required_error: 'Lastname is required.'
        }).min(2, 'Last name too short!'),
        email: string({
            required_error: 'Email is required.'
        })
        .email('Not a valid email.'),
        countryCode: string({
            required_error: 'Country Code is required.'
        }).regex(new RegExp('^\\d\\d?$'), 'Invalid country code.'),
        phone: string({
            required_error: 'Phone number is required.'
        }).regex(new RegExp('^\\d{10}$'), 'Please enter a valid phone number (10 digits).')
    })
});

const getUserByEmailSchema = object ({
    body: object({
        email: string({
            required_error: 'Email is required.'
        })
        .email('Not a valid email.'),
    })
});

const updateUserSchema = object ({
    body: object({
        fields: string({
            required_error: 'Fields is required.'
        }).min(1, 'Field element cannot be empty.').array().nonempty('Missing fields').length(1, 'Missing fields'),
        user: object({
            firstName: string({
                required_error: 'Firstname is required.'
            }).min(2, 'First name too short!'),
            phone: string({
                required_error: 'Phone number is required.'
            }).regex(new RegExp('^\\d{10}$'), 'Please enter a valid phone number (10 digits).'),
            countryCode: string({
                required_error: 'Country Code is required.'
            }).regex(new RegExp('^\\d\\d?$'), 'Invalid country code.'),
            email: string({
                required_error: 'Email is required.'
            }).email('Not a valid email.'),
        })
    })
});

export {createUserSchema, getUserByEmailSchema, updateUserSchema}