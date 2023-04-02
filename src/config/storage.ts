import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

export const uploadImageFirebase = async (file: Express.Multer.File, folder = 'images') => {
    const filename = uuidv4() + '_' + file.originalname;
    const imageUploadRef = ref(storage, `${folder}/${filename}`);
    const metadata = {
        contentType: file.mimetype
    };
    const snapshot = await uploadBytes(imageUploadRef, file.buffer, metadata);
    return await getDownloadURL(snapshot.ref);
};
