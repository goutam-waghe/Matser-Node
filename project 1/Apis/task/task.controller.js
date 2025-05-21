import { taskModel } from "../../models/taskModel.js";

export const getAllTask = async function (req, res, next) {
  try {
    const userId = req.user._id;
    console.log(userId);
    let task = await taskModel.find({ user: userId });
    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.json({
      sucess: false,
      message: error.message,
    });
  }
};

export const createTask = async function (req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.json({
        success: false,
        message: "title is required",
      });
    }
    await taskModel.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(200).json({
      sucess: true,
      message: "task is created",
    });
  } catch (error) {
    res.json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const updatetask = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    task.title = title;
    task.description = description;

    await task.save();
    res.status(200).json({
      success: true,
      message: "task updated succesfully",
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: `Error : ${error.message}`,
    });
  }
};
export const deleteTask = async function (req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }
    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `ERROR : ${error.message}`,
    });
  }
};
