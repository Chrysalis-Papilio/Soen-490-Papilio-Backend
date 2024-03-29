import multer from 'multer';
import { Request } from 'express';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';

const storage = multer.memoryStorage();

const fileFilter = (_: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (file.mimetype.split('/')[0] === 'image') {
        callback(null, true);
    } else {
        callback(new APIError('Invalid file type, must be image', 'Multer Upload', httpStatusCode.BAD_REQUEST));
    }
};

const limits = {
    files: 5, // 5 files max
    fileSize: 10485760 // MAXIMUM: 10 megabytes = 10,485,760 bytes
};

export const upload = multer({
    storage,
    fileFilter,
    limits
});
