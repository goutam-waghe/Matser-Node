import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTask,
  updatetask,
} from "./task.controller.js";
import { isAuthanticated } from "../../Middlewares/auth.js";

const taskRouter = Router();

taskRouter.route("/createtask").post(isAuthanticated, createTask);
taskRouter.route("/updatetask/:id").put(isAuthanticated, updatetask);
taskRouter.route("/alltask").get(isAuthanticated, getAllTask);
taskRouter.route("/deletetask/:id").delete(isAuthanticated, deleteTask);
export default taskRouter;
