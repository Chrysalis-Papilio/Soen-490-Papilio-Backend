import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase
// @ts-ignore
const app = initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
});
const storage = getStorage();

export const uploadImageFirebase = async (file: Express.Multer.File) => {
    const filename = uuidv4() + '_' + file.originalname;
    const imageUploadRef = ref(storage, 'images/' + filename);
    const metadata = {
        contentType: file.mimetype
    };
    const snapshot = await uploadBytes(imageUploadRef, file.buffer, metadata);
    return await getDownloadURL(snapshot.ref);
};

export const deleteEmployee = async (employeeFirebaseId: string) => {
    try {
        await admin.auth().deleteUser(employeeFirebaseId);
    } catch (e) {}
};
