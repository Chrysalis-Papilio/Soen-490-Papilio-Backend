import express from "express";
import bodyParser from "body-parser";

const app = express();
const userRouter = require("./route/user");
const activityRouter = require("./route/activity");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/user", userRouter);
app.use("/activity", activityRouter);

app.listen(3000, () => {
    console.log("Server listening on port 3000...");
})
