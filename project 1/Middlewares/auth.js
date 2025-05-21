import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const isAuthanticated = async function (req, res, next) {
  try {
    console.log("running");
    const token = req.headers.token.split(" ")[1];
    console.log(token);

    if (!token)
      return res.json({
        success: false,
        message: "please login",
      });
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode._id);
    req.user = user;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: `error ${error.message}`,
    });
  }
};
