import { userModel } from "../../models/userModel.js";
import bcrypt from "bcrypt";
export const userRegister = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(404).json({
        success: false,
        message: "user Already exits",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
      username: name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "user created",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `error ${error.message}`,
    });
  }
};
//login
export const userLogin = async function (req, res, next) {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "usr not found",
    });
  }
  const isMatched = await bcrypt.compare(password, user.password);
  console.log(isMatched);
  if (!isMatched)
    return res
      .status(401)
      .json({ status: false, message: "password or email is wrong" });

  const token = user.generateToken();
  res.status(200).json({
    success: true,
    message: "login succesfull",
    token,
  });
};
//get profile
export const userProfile = async function (req, res, next) {
  try {
    const user = await userModel.findById(req.user._id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
    });
  }
};
//update profile
export const updateProfile = async function (req, res, next) {
  const id = req.user._id;
  const { email, name } = req.body;
  console.log(email, name);
  const user = await userModel.findById(id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  if (email) user.email = email;
  if (name) user.username = name;

  await user.save();

  res.status(200).json({
    success: true,
    message: "user updated successfully",
  });
};
//change password
export const changePassword = async function (req, res, next) {
  const id = req.user._id;
  const { oldPassword, newPassword } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  const isMateched = await bcrypt.compare(oldPassword, user.password);
  if (!isMateched) {
    return res.json({
      success: false,
      message: "password is incorrect!",
    });
  }
  console.log(newPassword);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "password is changed successfully",
  });
};
//delete password
export const deleteProfile = async function (req, res, next) {
  const id = req.user._id;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
};
