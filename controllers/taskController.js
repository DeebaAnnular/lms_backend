const EmployeeTask = require("../models/taskModal");

exports.createTask = async (req, res) => {
  try {
    const result = await EmployeeTask.createTask(req.body);
    res.status(201).json({ task_id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await EmployeeTask.getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await EmployeeTask.getTaskById(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const result = await EmployeeTask.updateTask(req.params.id, req.body);
    if (result.affectedRows > 0) {
      res.status(200).json({ ...req.body, task_id: req.params.id });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await EmployeeTask.deleteTask(req.params.id);
    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "Task deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Task not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the task",
      error: error.message,
    });
  }
};
