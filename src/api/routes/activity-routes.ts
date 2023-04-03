import express from 'express';
import { activityController } from '../controllers';
import * as activitySchema from '../schemas/activity-schema';
import { validate } from '../middlewares/validateResource';
import { upload } from '../middlewares/multerUpload';

const router = express.Router();

/** GET */

router.get('/activity/get/:activityId', validate(activitySchema.getActivity), activityController.getActivity);

router.get('/activity/getFeeds', validate(activitySchema.getFeeds), activityController.getAllActivities);

router.post('/activity/update/:activityId', validate(activitySchema.updateActivity), activityController.updateActivity);

router.post('/activity/updateImages/:activityId', [upload.array('images', 5), validate(activitySchema.updateActivityImages)], activityController.updateActivityImages);

router.post('/activity/search', validate(activitySchema.searchActivities), activityController.searchActivities);

router.post('/activity/close/:activityId', validate(activitySchema.closeActivity), activityController.closeActivity);

router.post('/activity/open/:activityId', validate(activitySchema.closeActivity), activityController.openActivity);

export default router;
