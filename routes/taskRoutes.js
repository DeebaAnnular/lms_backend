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
  updateApprovalStatus,
  updateRejectStatus,
  getAllWeeklyStatuses
} = require("../controllers/taskController");


router.post("/create_task", createTask);
router.get("/get_all_tasks", getAllTasks);
router.get("/get_task_by_id/:id", getTaskById);
router.put("/update_task_by_id/:id", updateTask);
router.delete("/delete_task/:id", deleteTask);
router.get("/weekly/:userId", getWeeklyData);
router.post("/create_weekly_status", createWeeklyStatus);
router.put("/approve_daily_task", updateApprovalStatus);
router.put("/reject_daily_task",  updateRejectStatus);
router.get('/get_weekly_status', getAllWeeklyStatuses);


module.exports = router;
