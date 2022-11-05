import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

router.get('/user/getAllUsers', userController.getAllUsers);

router.get('/user/get/:id', validate(userSchema.getUserById), userController.getUserById);

router.get('/user/getUserByEmail/:email', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

router.post('/user/createUser', validate(userSchema.createUserSchema), userController.createUser);

export = router;
