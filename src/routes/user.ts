import express from "express";

const router = express.Router();

router.get("/profile/:userId", (req, res) => {
    res.send(`GET /user/profile/${req.params.userId}`);
});

module.exports = router;
