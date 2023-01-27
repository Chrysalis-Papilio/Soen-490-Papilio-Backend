import express from 'express';
import { activityController } from '../controllers';

const router = express.Router();

/** GET */

router.get('/activity/get/:activityId', (req, res) => {
    res.send(`GET /activity/get/${req.params.activityId}`);
});

// FIXME: TESTING PURPOSE ONLY
router.get('/activity/getAllActivities', activityController.getAllActivities);

export default router;
