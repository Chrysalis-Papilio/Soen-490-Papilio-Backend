import express from 'express';
import { activityController } from '../controllers';
import * as activitySchema from '../schemas/activity-schema';
import { validate } from '../middlewares/validateResource';

const router = express.Router();

/** GET */

// FIXME: force activityId to be numerical, might consider using UUID in future
router.get('/activity/get/:activityId', activityController.getActivity);

router.get('/activity/getFeeds', validate(activitySchema.getFeeds), activityController.getAllActivities);

export default router;
