import { applicationDefault, initializeApp } from 'firebase-admin/app';
import * as admin from 'firebase-admin';
import { httpStatusCode } from '../types/httpStatusCodes';
import { APIError } from '../errors/api-error';

initializeApp({
    credential: applicationDefault()
});

export const deleteEmployee = async (employeeFirebaseId: string) => {
    try {
        await admin.auth().deleteUser(employeeFirebaseId);
    } catch (e) {
        throw new APIError('The ID associated with this email is blocked.', 'addNewEmployee', httpStatusCode.CONFLICT);
    }
};
