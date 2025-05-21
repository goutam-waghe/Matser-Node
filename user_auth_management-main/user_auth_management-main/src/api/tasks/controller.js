//NPM
import { validationResult } from "express-validator";
//Functions
import { listUserTasks, saveTasks } from "./service.js";


/**
 * @Method Method used to register new user in platform
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        //use validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: errors.errors[0]["msg"],
            })
        }

        const tasks = {
            userId: userId,
            title: title,
            description: description
        }

        const taskData = await saveTasks(tasks);

        if (taskData) {

            return res.status(200).send({
                status: true,
                message: "Tasks created successfully",
            });
        }

        return res.send({
            status: false,
            message: "Failed to create the tasks",
        });

    } catch (error) {

        return res.send({
            status: false,
            message: error.message,
        })
    }
};


/**
 * @Method Method used to register new user in platform
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 10-FEB-2025
 */
export const listTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const taskData = await listUserTasks(userId);

        return res.send({
            status: false,
            message: "Get user tasks successful",
            data: taskData
        });

    } catch (error) {

        return res.send({
            status: false,
            message: error.message,
        })
    }
};