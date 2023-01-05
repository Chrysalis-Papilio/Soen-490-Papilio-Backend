import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

/** GET */

router.get('/user/getAllUsers', validate(userSchema.getAllUsers), userController.getAllUsers);

router.get('/user/get/:id', validate(userSchema.getUserById), userController.getUserById);

router.get('/user/getUserByEmail/:email', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);

/** PUT */

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

/** POST */

router.post('/user/createUser', validate(userSchema.createUserSchema), userController.createUser);

router.post('/user/addActivity/:id', validate(userSchema.addNewUserActivity), userController.addNewUserActivity);

export = router;
