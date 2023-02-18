import express from 'express';
import { activityController } from '../controllers';
import * as activitySchema from '../schemas/activity-schema';
import { validate } from '../middlewares/validateResource';

const router = express.Router();

/** GET */

router.get('/activity/get/:activityId', validate(activitySchema.getActivity), activityController.getActivity);

router.get('/activity/getFeeds', validate(activitySchema.getFeeds), activityController.getAllActivities);

router.get('/activity/search', activityController.searchActivities);

export default router;
