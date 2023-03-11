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

router.get('/user/get/:id/favoriteActivities', validate(userSchema.getUserActivityList), userController.getUserFavoriteActivityList);

router.get('/user/activity/:id/checkJoined/:activityId', validate(userSchema.checkJoinedActivity), userController.checkJoinedActivity);

/** PUT */

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

router.put('/user/addFavoriteActivity', validate(userSchema.userAddFavoriteActivitySchema), userController.addFavoriteActivity);

router.put('/user/submitQuiz/:id', validate(userSchema.submitQuiz), userController.submitQuiz);

/** POST */

router.post('/user/createUser', validate(userSchema.createUserSchema), userController.createUser);

router.post('/user/addActivity/:id', [upload.array('images', 5), validate(userSchema.addNewUserActivity)], userController.addNewUserActivity);

router.post('/user/activity/:id/join/:activityId', validate(userSchema.joinActivity), userController.joinActivity);

/** DELETE */

router.delete('/user/activity/:id/unjoin/:activityId', validate(userSchema.unjoinActivity), userController.unjoinActivity);

export = router;
