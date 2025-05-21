import express from "express";
const router = express.Router();
import upload from "../helper/common/multerConfig.js";
import { validator } from "../helper/common/validator.js";
import authMiddleware from "../helper/common/jwtMiddelware.js";
import {
    userLogin,
    deleteUser,
    getUserList,
    userRegister,
    getUserDetail,
    changePassword,
    updateUserDetail,
    uploadFileOnLocal,
    uploadProfileImage,
} from "./controller.js";

router.post("/userLogin", userLogin);
router.post("/getUserList", getUserList);
router.delete("/deleteUser", authMiddleware, deleteUser);
router.get("/getUserDetail", authMiddleware, getUserDetail);
router.patch("/changePassword", authMiddleware, changePassword);
router.put("/updateUserDetail", authMiddleware, updateUserDetail);
router.post("/uploadFileOnLocal", authMiddleware, uploadFileOnLocal);
router.post("/userRegister", validator("registerValidation"), userRegister);
router.post("/upload", authMiddleware, upload.single("profileImage"), uploadProfileImage);

export default router;