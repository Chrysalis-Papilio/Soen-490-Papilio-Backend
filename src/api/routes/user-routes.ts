import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.get('/user/get', userController.getAllUsers);

router.get('/user/getUserByEmail', userController.getUserByEmail);

router.post('/user/createSampleUser', userController.createSampleUser);

router.post('/user/createSimpleUser', userController.createSimpleUser);

router.post('/user/updateUserProfile', userController.updateUserProfile);

export = router;
