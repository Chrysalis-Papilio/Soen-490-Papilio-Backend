import express from 'express';
import { activityController } from '../controllers';

const router = express.Router();

/** GET */

// FIXME: force activityId to be numerical, might consider using UUID in future
router.get('/activity/get/:activityId', activityController.getActivity);

// FIXME: TESTING PURPOSE ONLY
router.get('/activity/getAllActivities', activityController.getAllActivities);

export default router;
