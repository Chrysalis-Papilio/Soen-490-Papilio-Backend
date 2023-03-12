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

router.get('/user/get-chat-user-token/:id', validate(userSchema.getChatUserToken), userController.getChatUserToken);

router.get('/user/activity/:user_id/checkJoined/:activity_id', validate(userSchema.checkJoinedActivity), userController.checkJoinedActivity);

router.get('/user/get/isActivityFavorite/:id/:activityId', validate(userSchema.getIsActivityFavorited), userController.checkActivityFavoritedByUser);

/** PUT */

router.put('/user/updateUserProfile', validate(userSchema.updateUserSchema), userController.updateUserProfile);

router.put('/user/addFavoriteActivity', validate(userSchema.userAddFavoriteActivitySchema), userController.addFavoriteActivity);

router.put('/user/removeFavoriteActivity', validate(userSchema.userRemoveFavoriteActivitySchema), userController.removeFavoriteActivity);

router.put('/user/submitQuiz/:id', validate(userSchema.submitQuiz), userController.submitQuiz);

router.put('/user/add-member-to-activity-chat', validate(userSchema.addMemberToActivityChat), userController.addMemberToActivityChat);

router.put('/user/remove-member-from-activity-chat', validate(userSchema.removeMemberFromActivityChat), userController.removeMemberFromActivityChat);

/** POST */

router.post('/user/createUser', validate(userSchema.createUserSchema), userController.createUser);

router.post('/user/addActivity/:id', [upload.array('images', 5), validate(userSchema.addNewUserActivity)], userController.addNewUserActivity);

router.post('/user/create-chat-by-admin-user', validate(userSchema.createChat), userController.createChat);

router.post('/user/create-stream-chat-user', validate(userSchema.newStreamChatUser), userController.createNewStreamChatUser);

router.post('/user/activity/:user_id/join/:activity_id', validate(userSchema.joinActivity), userController.joinActivity);

/** DELETE */

router.delete('/user/delete-activity-chat/:activity_id', validate(userSchema.deleteActivityChat), userController.deleteActivityChat);

router.delete('/user/activity/:user_id/unjoin/:activity_id', validate(userSchema.unjoinActivity), userController.unjoinActivity);

export = router;
