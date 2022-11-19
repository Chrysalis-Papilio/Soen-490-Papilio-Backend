import { object, string } from 'zod';

/** Attributes */

const mention = string({
    required_error: 'Mention is required',
    invalid_type_error: 'Mention should be of type string'
});

const lineOne = string({
    required_error: 'Line One is required',
    invalid_type_error: 'Line One should be of type string'
}).min(5, 'Line One too short!');

const lineTwo = string({
    required_error: 'Line Two is required',
    invalid_type_error: 'Line Two should be of type string'
});

const city = string({
    required_error: 'City is required',
    invalid_type_error: 'City should be of type string'
});

const state = string({
    required_error: 'State/Province is required',
    invalid_type_error: 'State/Province should be of type string'
}).regex(new RegExp('^[A-Z]{2,4}'));

const country = string({
    required_error: 'Country is required',
    invalid_type_error: 'Country should be of type string'
});

const postalCode = string({
    required_error: 'Postal code is required',
    invalid_type_error: 'Postal Code should be of type string'
});

/** Schemas */

const addressSchema = object({
    // Required
    lineOne: lineOne,
    city: city,
    state: state,
    country: country,
    postalCode: postalCode,

    // Optional
    mention: mention.optional(),
    lineTwo: lineTwo.optional()
});

export { mention, lineOne, lineTwo, city, state, country, postalCode };
export { addressSchema };
