import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, default: "" },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phoneNumber: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    address: { type: String, default: "" },
    profileImage: { type: String, default: "" } // Store file path
},
    {
        timestamps: true,
        typeCast: true
    }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;