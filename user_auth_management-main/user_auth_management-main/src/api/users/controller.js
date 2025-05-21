//NPM
import fs from "fs";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Multiparty from "multiparty";
import { validationResult } from "express-validator";
//Models
import userModel from "../../models/users.js";
//Response
import userResponse from "../../response/userResponse.js";
//Functions
import logger from '../../../logger.js';
import config from "../../helper/envconfig/envVars.js";
import { emailExist, getUserByEmail, getUserById } from "./service.js";
import { createJwtToken, getMessage } from "../../helper/common/helpers.js";


/**
 * @Method Method used to register new user in platform
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const userRegister = async (req, res) => {
    try {
        const { language = "en", userName, email, password, address, countryCode, phoneNumber } = req.body;

        //use validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: await getMessage(language, errors.errors[0]["msg"]),
            })
        }
        //email valid regex
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return res.send({
                status: false,
                message: await getMessage(language, "Invalid_Email_Address")
            });
        }

        //email convert in lower case
        const lowerEmail = email.toLowerCase();

        //function used to check email already exist or not
        const checkEmail = await emailExist(lowerEmail);
        if (checkEmail) {
            return res.send({
                status: false,
                message: await getMessage(language, "Email_Already_Exist"),
            });

        }

        const userObj = new userModel({
            userName: userName || "",
            email: lowerEmail,
            password: bcrypt.hashSync(password, 10),
            address: address || "",
            countryCode: countryCode || "",
            phoneNumber: phoneNumber || ""
        });

        const userSave = await userObj.save();

        if (userSave) {
            //create jwt token
            const jwtToken = await createJwtToken({ id: userSave._id });

            return res.status(200).send({
                status: true,
                token: jwtToken,
                message: await getMessage(language, "User_Register_Success"),
            })
        }

        return res.send({
            status: false,
            message: await getMessage(language, "Feild_To_Register_User"),
        });

    } catch (error) {

        return res.send({
            status: false,
            message: error.message,
        })
    }
};

/**
 * @Method method used to user login by email and password
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025 
 */
export const userLogin = async (req, res) => {
    try {

        const { language, email, password } = req.body;

        //valifation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                status: false,
                message: await getMessage(language, errors.error[0]['msg']),
            })
        }
        //get user by email
        const checkUser = await getUserByEmail(email.toLowerCase());
        if (!checkUser) {
            return res.status(404).send({
                status: false,
                message: await getMessage(language, "User_Does_Not_Exist"),
            })
        }

        if (bcrypt.compareSync(password, checkUser.password)) {

            //generate jwt token
            const token = await createJwtToken({ id: checkUser._id });

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "User_Login_Success"),
                token: token,
                data: new userResponse(checkUser),
            })
        } else {
            return res.status(400).send({
                status: false,
                message: await getMessage(language, "Envalid_Email_Password")
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
/**
 * @Method used to change user password
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const changePassword = async (req, res) => {
    try {
        const { language, oldPassword, newPassword } = req.body;
        //decoded user id
        const userId = req.user.id; // Get user ID from auth middleware

        // Find user
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "User_Not_Found"
            });
        }

        // Check if old password is correct
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                status: false,
                message: await getMessage(language, "Old_Password_Incorrect")
            });
        }

        //update new passowrd in DB
        await userModel.updateOne(
            { _id: userId },
            {
                $set: {
                    password: bcrypt.hashSync(newPassword, 10)
                }
            }
        )
        res.status(200).send({
            status: true,
            message: await getMessage(language, "Password_Chnage_Success")
        });

    } catch (error) {
        logger.error("changePassword : Error==>> " + error.message);
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

/**
 * @Method Method used to get user details
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const getUserDetail = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id; //Login user id
        const language = req.query.language;

        //get user data by id
        const getUserData = await getUserById(userId);

        if (getUserData) {
            return res.send({
                status: true,
                message: await getMessage(language, "Get_User_Details_Success"),
                data: new userResponse(getUserData),
            })
        }

        return res.send({
            status: false,
            message: await getMessage(language, "Data_Not_Found"),
        });

    } catch (error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
};

/**
 * @Method Method used for update user details
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2024
 */
export const updateUserDetail = async (req, res) => {
    try {
        const { language = "en", userName, address, countryCode, phoneNumber } = req.body;

        //decoded user id
        const userId = req.user.id;

        //get user data by id 
        const userData = await getUserById(userId);
        if (userData) {


            //update user data
            const updateData = await userModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(userId) },
                {
                    $set: {
                        userName,
                        address,
                        countryCode,
                        phoneNumber
                    }
                },
                { new: true }
            );

            return res.status(200).send({
                status: true,
                messgae: await getMessage(language, "Field_Update_User_Details"),
                data: new userResponse(updateData),
            })
        } else {
            return res.send({
                status: false,
                message: await getMessage(language, "Data_Not_Found")
            })
        }

    } catch (error) {
        console.log("SSS=== ", error)
        return res.send({
            status: false,
            message: error.message,
        })
    }
}

/**
 * @Method Method used to get all user list with filter and pagination
 * @param {*} req 
 * @param {*} res 
 * @date 08-FEB-2025
 */
export const getUserList = async (req, res) => {
    try {
        const { language, search, page = 1, perPage = 10 } = req.body;

        //pagination
        const pageNo = (page - 1) * perPage;

        let filter = {};
        //search filter
        if (search) {
            const reg = {
                userName: { $regex: ".*" + search + ".*", $options: "i" }
            };

            filter = Object.assign(filter, reg);
        }

        //get user list
        const getAllUsers = await userModel.find(filter)
            .sort({ _id: -1 })
            .skip(pageNo)
            .limit(perPage);

        if (getAllUsers && getAllUsers.length) {
            const madeUserResponse = await Promise.all(getAllUsers.map(async (user) => {
                return new userResponse(user);
            })//map
            )//promise

            //get total count
            const totalCount = await userModel.countDocuments(filter);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "User_List_Fetched_Success"),
                totalCount: totalCount,
                data: madeUserResponse,

            })
        } else {
            return res.send({
                status: false,
                message: await getMessage(language, "Data_Not_Found"),
                data: []
            })
        }

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: error.message,
        })
    }
}

/**
 * @Method Method used to delete user by id
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const deleteUser = async (req, res) => {
    try {
        //decoded user id
        const userId = req.user.id;
        const language = req.query.language;

        if (userId) {
            const deleteUser = await userModel.deleteOne({ _id: userId });

            if (deleteUser) {
                return res.send({
                    status: true,
                    message: "User delete successfully"
                })
            };

            return res.send({
                status: false,
                message: "Feild to delete user."
            })
        } else {
            return res.send({
                status: false,
                message: "Something wan't wrong please try again."
            })
        }
    } catch (error) {
        return res.send({
            status: false,
            message: error.message,
        })
    }
};

/**
 * @Method method used for upload image by multer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const uploadProfileImage = async (req, res) => {
    try {
        //decoded user id
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).send({
                status: false,
                message: "No file uploaded"
            });
        }

        const IMAGE_UPLOAD_DIR = "assets/userImages";
        const { previousFile } = req.body;

        //delete previous file
        if (previousFile && previousFile != "") {
            let filePath = `${IMAGE_UPLOAD_DIR}/${previousFile}`;
            fs.unlink(filePath, (err) => {
                if (!err) console.log(`${filePath} was deleted`);
                else console.log("Error in deleting file ===== " + err);
            });
        }

        // Fix backslashes in file path
        let filePath = req.file.path.replace(/\\/g, "/");

        const saveProfile = await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    profileImage: filePath // Save file path}
                }
            },
            { new: true }
        );

        const savedUser = await saveProfile.save();

        return res.status(200).send({
            status: true,
            message: "File uploaded successfully",
            data: new userResponse(savedUser),
        });

    } catch (error) {
        return res.status(500).send(
            {
                status: false,
                message: error.message
            });
    }
};

/**
 * @Method method used to upload image using by multiparty
 * @param {*} req 
 * @param {*} res 
 * @date 09-FEB-2025
 */
export const uploadFileOnLocal = async (req, res) => {
    try {
        const { language, previousFile } = req.body;
        //decoded user id
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).send({
                status: false,
                message: "No file uploaded"
            });
        };

        const IMAGE_UPLOAD_DIR = "assets/userImages";

        //delete previous file
        if (previousFile && previousFile != "") {
            let filePath = `${IMAGE_UPLOAD_DIR}/${previousFile}`;
            fs.unlink(filePath, (err) => {
                if (!err) logger.info(`${filePath} was deleted`);
                else logger.info("Error in deleting file ===== " + err);
            });
        };

        //use Multiparty module
        let form = new Multiparty.Form({ uploadDir: IMAGE_UPLOAD_DIR });
        form.parse(req, async (err, fields, files) => {

            if (err) return res.status(200).send({ error: err.message })
            //if image multiple
            let obj1 = {};
            let imgPath = files.file[0].path.split("/");
            obj1.imageName = IMAGE_UPLOAD_DIR + "/" + imgPath[imgPath.length - 1];
            obj1.imagePath = config.IMAGE_ACCESS_URL + IMAGE_UPLOAD_DIR + '/' + imgPath[imgPath.length - 1];

            const saveProfile = await userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        profileImage: obj1.imageName // Save file path}
                    }
                },
                { new: true }
            );

            const savedUser = await saveProfile.save();

            return res.send({
                status: 1,
                message: "Image upload success",
                data: obj1,
            });
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message,
        })
    }
}