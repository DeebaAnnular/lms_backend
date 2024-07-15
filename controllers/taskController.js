const { format } = require("date-fns");
const EmployeeTask = require("../models/taskModal"); // Ensure the correct path

exports.createTask = async (req, res) => {
  try {
    const result = await EmployeeTask.createTask(req.body);
    const task = { task_id: result.insertId, ...req.body };
    task.task_date = format(new Date(task.task_date), "yyyy-MM-dd");
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await EmployeeTask.getAllTasks();
    const formattedTasks = tasks.map((task) => {
      task.task_date = format(new Date(task.task_date), "yyyy-MM-dd");
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
      task.task_date = format(new Date(task.task_date), "yyyy-MM-dd");
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
      task.task_date = format(new Date(task.task_date), "yyyy-MM-dd");
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

exports.getWeeklyData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    if (!fromDate || !toDate) {
      return res
        .status(400)
        .json({ error: "Both fromDate and toDate are required" });
    }

    const tasks = await EmployeeTask.getWeeklyData(userId, fromDate, toDate);

    // Process the results
    const formattedTasks = tasks.map((task) => ({
      day: task.day,
      task_id: task.task_id.split(",").map((id) => parseInt(id.trim(), 10)),
      task_name: task.task_name.split(",").map((name) => name.trim()),
      total_hours_per_day: parseFloat(task.total_hours_per_day).toFixed(2),
    }));

    // Calculate the total hours
    const totalHours = formattedTasks
      .reduce((sum, task) => sum + parseFloat(task.total_hours_per_day), 0)
      .toFixed(2);

    res.status(200).json({
      fromDate,
      toDate,
      tasks: formattedTasks,
      totalHours,
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

// controllers/weeklyStatusController.js

exports.createWeeklyStatus = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.body;

    // Validate input
    if (!userId || !fromDate || !toDate) {
      return res
        .status(400)
        .json({ error: "userId, fromDate, and toDate are required" });
    }

    // Create new weekly status
    const weekId = await EmployeeTask.createWeeklyStatus(
      userId,
      fromDate,
      toDate
    );

    // Fetch the created weekly status
    const createdStatus = await EmployeeTask.getWeeklyStatusById(weekId);

    res.status(201).json({
      message: "Weekly status created successfully",
      weeklyStatus: createdStatus,
    });
  } catch (error) {
    console.error("Error in createWeeklyStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.approveWeeklyStatus = async (req, res) => {
  try {
    const { weekId } = req.params;
    const { approvedBy } = req.body;

    // Validate input
    if (!weekId || !approvedBy) {
      return res
        .status(400)
        .json({ error: "weekId and approvedBy are required" });
    }

    // Approve the weekly status
    const success = await EmployeeTask.updateWeeklyStatusToApproved(
      weekId,
      approvedBy
    );

    if (success) {
      const updatedStatus = await EmployeeTask.getWeeklyStatusById(weekId);
      res.status(200).json({
        message: "Weekly status approved successfully",
        weeklyStatus: updatedStatus,
      });
    } else {
      res.status(404).json({ error: "Weekly status not found" });
    }
  } catch (error) {
    console.error("Error in approveWeeklyStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectWeeklyStatus = async (req, res) => {
  try {
    const { weekId } = req.params;
    const { comment, approvedBy } = req.body;

    // Validate input
    if (!weekId || !comment || !approvedBy) {
      return res
        .status(400)
        .json({ error: "weekId, comment, and approvedBy are required" });
    }

    // Reject the weekly status
    const success = await EmployeeTask.updateWeeklyStatusToRejected(
      weekId,
      comment,
      approvedBy
    );

    if (success) {
      const updatedStatus = await EmployeeTask.getWeeklyStatusById(weekId);
      res.status(200).json({
        message: "Weekly status rejected successfully",
        weeklyStatus: updatedStatus,
      });
    } else {
      res.status(404).json({ error: "Weekly status not found" });
    }
  } catch (error) {
    console.error("Error in rejectWeeklyStatus:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllWeeklyStatuses = async (req, res) => {
  try {
    const weeklyStatuses = await EmployeeTask.getAllWeeklyStatuses();
    res.status(200).json({
      message: "Weekly statuses fetched successfully",
      weeklyStatuses,
    });
  } catch (error) {
    console.error("Error in getAllWeeklyStatuses:", error);
    res.status(500).json({ error: error.message });
  }
};
