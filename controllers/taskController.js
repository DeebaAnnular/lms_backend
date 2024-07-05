const { format } = require('date-fns');
const EmployeeTask = require("../models/taskModal") // Ensure the correct path

exports.createTask = async (req, res) => {
  try {
    const result = await EmployeeTask.createTask(req.body);
    const task = { task_id: result.insertId, ...req.body };
    task.task_date = format(new Date(task.task_date), 'yyyy-MM-dd');
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await EmployeeTask.getTasks();
    const formattedTasks = tasks.map(task => {
      task.task_date = format(new Date(task.task_date), 'yyyy-MM-dd');
      return task;
    });
    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await EmployeeTask.getTaskById(req.params.id);
    if (task) {
      task.task_date = format(new Date(task.task_date), 'yyyy-MM-dd');
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
      const task = { ...req.body, task_id: req.params.id };
      task.task_date = format(new Date(task.task_date), 'yyyy-MM-dd');
      res.status(200).json(task);
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
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
