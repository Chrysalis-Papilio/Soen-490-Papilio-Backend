import express from 'express';
import * as userController from '../controllers/user';

const router = express.Router();

router.get('/user/get', userController.getAllUsers);
router.post('/user/createSampleUser', userController.createSampleUser);

export = router;
