import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const FirebaseStorage = require('multer-firebase-storage');

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

export const uploadFirebase = multer({
    storage: FirebaseStorage({
        bucketName: process.env.BUCKET_NAME,
        credentials: require('../../../credentials.json'),
        directoryPath: 'images',
        namePrefix: uuidv4() + '_',
        public: true
    })
});
