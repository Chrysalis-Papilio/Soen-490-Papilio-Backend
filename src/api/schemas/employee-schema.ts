import { boolean, object, string } from 'zod';
import { requiredMessage, invalidMessage } from './util';

/** Attributes */

const employeeId = string({
    required_error: requiredMessage('Employee Firebase ID'),
    invalid_type_error: invalidMessage('Employee Firebase ID', 'string')
});

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
}).min(2, 'Last Name too short!');

const email = string({
    required_error: requiredMessage('Email'),
    invalid_type_error: invalidMessage('Email', 'string')
}).email('Invalid email');

const role = string({
    required_error: requiredMessage('Role'),
    invalid_type_error: invalidMessage('Role', 'string')
});

const root = boolean({
    required_error: requiredMessage('Root'),
    invalid_type_error: invalidMessage('Root', 'boolean')
});

/** Schemas */

const employeeSchema = object({
    firebase_id: firebase_id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
    root: root
});

export { employeeId, firebase_id, firstName, lastName, email, role, root };
export { employeeSchema };
