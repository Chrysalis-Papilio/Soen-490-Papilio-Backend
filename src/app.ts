import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const database = require("./database");
const userRouter = require("./routes/user-routes");
const activityRouter = require("./routes/activity-routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/user", userRouter);
app.use("/activity", activityRouter);

database.sync({force: true}).then();

app.listen(3000, () => {
    console.log("Server listening on port 3000...");
})

module.exports = app;
