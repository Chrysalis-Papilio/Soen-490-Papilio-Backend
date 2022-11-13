import { boolean, object, string } from 'zod';

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

export { employeeSchema };
