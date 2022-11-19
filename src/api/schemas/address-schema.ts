import { object, string } from 'zod';
import { invalidMessage, requiredMessage } from './util';

/** Attributes */

const mention = string({
    required_error: requiredMessage('Mention'),
    invalid_type_error: invalidMessage('Mention', 'string')
});

const lineOne = string({
    required_error: requiredMessage('Line One'),
    invalid_type_error: invalidMessage('Line One', 'string')
}).min(5, 'Line One too short!');

const lineTwo = string({
    required_error: requiredMessage('Line Two'),
    invalid_type_error: invalidMessage('Line Two', 'string')
});

const city = string({
    required_error: requiredMessage('City'),
    invalid_type_error: invalidMessage('City', 'string')
});

const state = string({
    required_error: requiredMessage('State/Province'),
    invalid_type_error: invalidMessage('State/Province', 'string')
}).regex(new RegExp('^[A-Z]{2,4}'));

const country = string({
    required_error: requiredMessage('Country'),
    invalid_type_error: invalidMessage('Country', 'string')
});

const postalCode = string({
    required_error: requiredMessage('Postal Code'),
    invalid_type_error: invalidMessage('Postal Code', 'string')
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
