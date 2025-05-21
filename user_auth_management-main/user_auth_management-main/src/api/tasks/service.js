import taskModel from "../../models/tasks.js";


/**
 * @Method Method used for get user data by email
 * @author Neeraj-Mehra
 * @param {*} email 
 * @date 10-FEB-2025
 */
export const saveTasks = async (tasks) => {
    try {
        const taskObj = new taskModel(tasks);

        return await taskObj.save();

    } catch (error) {
        throw new Error(error.message);
    }
};


/**
 * @Method Method used for get user data by email
 * @author Neeraj-Mehra
 * @param {*} email 
 * @date 10-FEB-2025
 */
export const listUserTasks = async (userId) => {
    try {
        return await taskModel.find({userId: userId}).lean();

    } catch (error) {
        throw new Error(error.message);
    }
};