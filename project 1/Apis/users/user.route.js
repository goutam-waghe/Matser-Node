import { Router } from "express";
import {
  changePassword,
  deleteProfile,
  updateProfile,
  userLogin,
  userProfile,
  userRegister,
} from "./user.controller.js";
import { isAuthanticated } from "../../Middlewares/auth.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/profile").get(isAuthanticated, userProfile);
userRouter.route("/updateprofile").put(isAuthanticated, updateProfile);
userRouter.route("/removeprofile").delete(isAuthanticated, deleteProfile);
userRouter.route("/changepassword").put(isAuthanticated, changePassword);

export default userRouter;
