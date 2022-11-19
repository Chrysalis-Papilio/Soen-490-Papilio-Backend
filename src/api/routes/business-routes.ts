import express from 'express';
import { businessController } from '../controllers';
import * as businessSchema from '../schemas/business-schema';
import { validate } from '../middlewares/validateResource';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

router.get('/business/get/:businessId', validate(businessSchema.getBusinessById), businessController.getBusinessById);

router.get('/business/get/:businessId/employees', validate(businessSchema.getEmployeeList), businessController.getEmployeeList);

router.get('/business/get/:businessId/activities', validate(businessSchema.getActivityList), businessController.getActivityList);

// router.post('/business/createSimpleBusiness', businessController.createSimpleBusiness);

router.get('/business/:businessId/employee/:employeeId', businessController.getEmployee);

router.post('/business/createBusiness', validate(businessSchema.createBusiness), businessController.createBusiness);

router.post('/business/addEmployee/:businessId', validate(businessSchema.addNewEmployee), businessController.addNewEmployee);

router.post('/business/addActivity/:businessId', validate(businessSchema.addNewActivity), businessController.addNewActivity);

router.delete('/business/:businessId/removeEmployee/:employeeId', validate(businessSchema.removeEmployee), businessController.removeEmployee);

router.delete('/business/:businessId/removeActivity/:activityId', validate(businessSchema.removeActivity), businessController.removeActivity);

router.put('/business/update/:businessId', validate(businessSchema.updateBusiness), businessController.updateBusiness);

router.put('/business/:businessId/updateEmployee/:employeeId', businessController.updateEmployee);

router.put('/business/:businessId/updateActivity/:activityId', businessController.updateActivity);

export = router;
