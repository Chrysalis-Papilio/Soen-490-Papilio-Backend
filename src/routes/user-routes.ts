import express from "express";

const router = express.Router();
const { Client } = require("pg");

router.get("/profile/:userId", (req, res) => {
    res.send(`GET /user/profile/${req.params.userId}`);
});

router.get("/all", async (_, res) => {
    try {
        const client = new Client();
        client.connect();
        const queryText = "SELECT name FROM overall";
        const all = await client.query(queryText);
        await client.end();
        res.send(all.rows);
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;
