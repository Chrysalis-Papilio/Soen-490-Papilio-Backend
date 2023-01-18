import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = require('../../credentials.json');

// Initialize Firebase
// @ts-ignore
const app = initializeApp(firebaseConfig);
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
