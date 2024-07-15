// const express = require('express');
// const router = express.Router();
// const taskController = require('../controllers/taskController');
// const weeklyStatusController = require('../controllers/weeklyStatusController');

// // Task routes
// router.post('/create_task', taskController.createTask);
// router.put('/task/:id', taskController.updateTask);
// router.delete('/task/:id', taskController.deleteTask);

// // WeeklyStatus routes
// router.post('/weekly-status', weeklyStatusController.createWeeklyStatus);
// router.put('/weekly-status/:id', weeklyStatusController.updateWeeklyStatus);
// router.get('/weekly-status', weeklyStatusController.getWeeklyStatusRange);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getWeeklyData,
  createWeeklyStatus,
  approveWeeklyStatus,
  rejectWeeklyStatus,
  getAllWeeklyStatuses
} = require("../controllers/taskController");

router.post("/create_task", createTask);
router.get("/get_all_tasks", getAllTasks);
router.get("/get_task_by_id/:id", getTaskById);
router.put("/update_task_by_id/:id", updateTask);
router.delete("/delete_task/:id", deleteTask);
router.get("/weekly/:userId", getWeeklyData);
router.post("/weekly_status", createWeeklyStatus);
router.put("/approveWeeklyStatus/:weekId", approveWeeklyStatus);
router.put("/rejectWeeklyStatus/:weekId", rejectWeeklyStatus);
router.get('/weeklyStatuses', getAllWeeklyStatuses);

module.exports = router;
