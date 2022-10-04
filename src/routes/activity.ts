import express from 'express';

const router = express.Router();

router.get('/general/:activityId', (req, res) => {
    res.send(`GET /activity/general/${req.params.activityId}`);
});

export default router;
