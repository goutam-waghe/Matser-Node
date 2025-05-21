import express from "express";
const router = express.Router();
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import { validator } from "../../helper/common/validator.js";
import {
    createTask, listTask
} from "./controller.js";

router.post("/create", authMiddleware, validator("registerTasks"), createTask);
router.get("/list", authMiddleware, listTask);

export default router;