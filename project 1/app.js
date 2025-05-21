import express from "express";
import { config } from "dotenv";
import userRouter from "./Apis/users/user.route.js";
import taskRouter from "./Apis/task/task.route.js";
config({ path: "./config/.env" });
const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/task", taskRouter);

export default app;
