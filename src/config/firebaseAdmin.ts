import { applicationDefault, initializeApp } from 'firebase-admin/app';
import * as admin from 'firebase-admin';

initializeApp({
    credential: applicationDefault()
});

export const deleteEmployee = async (employeeFirebaseId: string) => {
    try {
        await admin.auth().deleteUser(employeeFirebaseId);
    } catch (e) {
        console.log(e);
    }
};
