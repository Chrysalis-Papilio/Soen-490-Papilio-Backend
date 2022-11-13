import { object, string } from 'zod';

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

export { addressSchema };
