import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.get('/user/get', userController.getAllUsers);

router.post('/user/createSampleUser', userController.createSampleUser);

router.post('/user/createSimpleUser', userController.createSimpleUser);

router.get('/user/getUserByEmail', userController.getUserByEmail);

export = router;
