import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';

const router = express.Router();

//  Throw proper error when req.body has syntax errors.

router.get('/user/getAllUsers', userController.getAllUsers);

router.get('/user/getUserByEmail', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);

router.post('/user/createSampleUser', userController.createSampleUser);

router.post('/user/createSimpleUser', validate(userSchema.createUserSchema), userController.createSimpleUser);

router.post('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

export = router;
