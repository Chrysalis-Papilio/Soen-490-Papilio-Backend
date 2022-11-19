import express from 'express';

const router = express.Router();

/** GET */

router.get('/activity/get/:activityId', (req, res) => {
    res.send(`GET /activity/get/${req.params.activityId}`);
});

export default router;
