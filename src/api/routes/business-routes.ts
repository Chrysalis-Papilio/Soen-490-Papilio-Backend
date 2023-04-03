import express from 'express';
import { businessController } from '../controllers';
import * as businessSchema from '../schemas/business-schema';
import { validate } from '../middlewares/validateResource';
import { upload } from '../middlewares/multerUpload';

const router = express.Router();

/** validate(...): Throw proper error when request is invalid */

/** GET */

router.get('/business/get/:businessId', validate(businessSchema.getBusinessById), businessController.getBusinessById);

router.get('/business/get/:businessId/employees', validate(businessSchema.getEmployeeList), businessController.getEmployeeList);

router.get('/business/get/:businessId/activities', validate(businessSchema.getActivityList), businessController.getActivityList);

router.get('/business/:businessId/employee/:employeeId', businessController.getEmployee);

/** POST */

router.post('/business/createSimpleBusiness', businessController.createSimpleBusiness); // testing only

router.post('/business/createBusiness', validate(businessSchema.createBusiness), businessController.createBusiness);

router.post('/business/addEmployee/:businessId', validate(businessSchema.addNewEmployee), businessController.addNewEmployee);

router.post('/business/addActivity/:businessId', [upload.array('images', 5), validate(businessSchema.addNewBusinessActivity)], businessController.addNewActivity);

/** DELETE */

router.delete('/business/:businessId/removeEmployee/:employeeId', validate(businessSchema.removeEmployee), businessController.removeEmployee);

router.delete('/business/:businessId/removeActivity/:activityId', validate(businessSchema.removeActivity), businessController.removeActivity);

router.delete('/business/:businessId', validate(businessSchema.removeBusiness), businessController.removeBusiness);

/** PUT */

router.put('/business/update/:businessId', validate(businessSchema.updateBusiness), businessController.updateBusiness);

router.put('/business/:businessId/updateEmployee/:employeeId', validate(businessSchema.updateEmployee), businessController.updateEmployee);

router.put('/business/:businessId/updateActivity/:activityId', validate(businessSchema.updateActivity), businessController.updateActivity);

router.put('/business/:businessId/registerAdTier', validate(businessSchema.registerAdTier), businessController.registerAdTier);

router.put('/business/:businessId/deregisterAdTier', validate(businessSchema.registerAdTier), businessController.deregisterAdTier);

export = router;
