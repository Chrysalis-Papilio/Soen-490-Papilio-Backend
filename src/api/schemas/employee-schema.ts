import { boolean, object, string } from 'zod';

/** Attributes */

const employeeId = string({
    required_error: 'Employee Firebase ID is required',
    invalid_type_error: 'Employee Firebase ID should be of type string'
});

const firebase_id = string({
    required_error: 'Firebase ID is required',
    invalid_type_error: 'Firebase ID should be of type string'
});

const firstName = string({
    required_error: 'First Name is required',
    invalid_type_error: 'First Name should be of type string'
}).min(2, 'First Name too short!');

const lastName = string({
    required_error: 'Last Name is required',
    invalid_type_error: 'Last Name should be of type string'
}).min(2, 'Last Name too short!');

const email = string({
    required_error: 'Email is required',
    invalid_type_error: 'Email should be of type string'
}).email('Invalid email');

const role = string({
    required_error: 'Role is required',
    invalid_type_error: 'Role should be of type string'
});

const root = boolean({
    required_error: 'Root is required',
    invalid_type_error: 'Root should be of type boolean'
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
