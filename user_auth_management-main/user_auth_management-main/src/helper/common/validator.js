import { body } from "express-validator";

export const validator = (method) => {
    switch (method) {
        case "registerValidation": {
            return [
                body("email", "Email_Id_Required").not().notEmpty(),
                body("password", "Password_Is_Required").not().notEmpty(),
                body("userName", "User_Name_Required").not().notEmpty(),
            ]
        }

        case "registerTasks": {
            return [
                body("title", "Title is required").not().notEmpty(),
                body("description", "Description is required").not().notEmpty(),
            ]
        }

        default:
            return "Somethong wan't wrong."
            break;
    }
}