import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';
import { upload } from '../middlewares/multerUpload';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

/** GET */

router.get('/user/getAllUsers', validate(userSchema.getAllUsers), userController.getAllUsers);

router.get('/user/get/:id', validate(userSchema.getUserById), userController.getUserById);

router.get('/user/getUserByEmail/:email', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);

router.get('/user/get/:id/activities', validate(userSchema.getUserActivityList), userController.getUserActivityList);

/** PUT */

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

router.put('/user/submitQuiz/:id', validate(userSchema.submitQuiz), userController.submitQuiz);

/** POST */

router.post('/user/createUser', validate(userSchema.createUserSchema), userController.createUser);

router.post('/user/addActivity/:id', [upload.array('images', 5), validate(userSchema.addNewUserActivity)], userController.addNewUserActivity);

export = router;
