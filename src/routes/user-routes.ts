import express from "express";
const User = require("../models/User");
const router = express.Router();

router.get("/profile/:userId", (req, res) => {
    res.send(`GET /user/profile/${req.params.userId}`);
});

router.post("/createSampleUser", async (_, res) => {
    const sample = await User.create({
        firstName: "Sample",
        lastName: "User",
        phone: "5145551234",
        email: "sample@gmail.com"
    });
    res.send(sample.toJSON());
})

module.exports = router;
