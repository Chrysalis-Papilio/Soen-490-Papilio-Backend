import express from 'express';
import { userController } from '../controllers';
import { validate } from '../middlewares/validateResource';
import * as userSchema from '../schemas/user-schema';

const router = express.Router();

//  Throw proper error when req.body has syntax errors.

router.get('/user/getAllUsers', userController.getAllUsers);

// router.get('/user/getUserByEmail/:email', validate(userSchema.getUserByEmailSchema), userController.getUserByEmail);
router.get('/user/getUserByEmail/:email', userController.getUserByEmail);

router.get('/user/get/:id', userController.getUserById);

router.post('/user/createSimpleUser', validate(userSchema.createUserSchema), userController.createSimpleUser);

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

export = router;
