import express from 'express';
import { businessController } from '../controllers';

const router = express.Router();

// TODO: Throw proper error

router.get('/business/get/:businessId', businessController.getBusinessById);

router.post('/business/createSimpleBusiness', businessController.createSimpleBusiness);

router.put('/business/update/:businessId', businessController.updateBusiness);

export = router;
