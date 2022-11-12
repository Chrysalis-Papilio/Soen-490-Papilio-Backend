import express from 'express';
import { businessController } from '../controllers';
import * as businessSchema from '../schemas/business-schema';
import { validate } from '../middlewares/validateResource';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

router.get('/business/get/:businessId', validate(businessSchema.getBusinessById), businessController.getBusinessById);

router.get('/business/get/:businessId/employees', validate(businessSchema.getEmployeeList), businessController.getEmployeeList);

router.get('/business/get/:businessId/activities', validate(businessSchema.getActivityList), businessController.getActivityList);

router.post('/business/createSimpleBusiness', businessController.createSimpleBusiness);

router.post('/business/createBusiness', validate(businessSchema.createBusiness), businessController.createBusiness);

router.post('/business/addEmployee/:businessId', validate(businessSchema.addNewEmployee), businessController.addNewEmployee);

router.post('/business/addActivity/:businessId', validate(businessSchema.addNewActivity), businessController.addNewActivity);

router.put('/business/update/:businessId', validate(businessSchema.updateBusiness), businessController.updateBusiness);

export = router;
