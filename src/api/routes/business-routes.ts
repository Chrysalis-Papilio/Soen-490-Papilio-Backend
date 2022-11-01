import express from 'express';
import { businessController } from '../controllers';

const router = express.Router();

// TODO: Throw proper error

router.get('/business/get/:businessId', businessController.getBusinessById);

router.get('/business/get/:businessId/employees', businessController.getEmployeeList);

router.post('/business/createSimpleBusiness', businessController.createSimpleBusiness);

router.post('/business/createBusiness', businessController.createBusiness);

router.put('/business/update/:businessId', businessController.updateBusiness);

export = router;
