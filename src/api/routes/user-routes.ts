import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';

const router = express.Router();

router.get('/getAllUsers', userController.getAllUsers);

router.get('/getUserByEmail', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);

router.post('/createSampleUser', userController.createSampleUser);

router.post('/createSimpleUser', validate(userSchema.createUserSchema), userController.createSimpleUser);

router.post('/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

export = router;
