const express = require('express');
const router = express.Router();
const {createTask,getTasks,getTask,updateTask,deleteTask} = require('../controllers/taskController');

router.post('/create_task', createTask);
router.get('/get_all_tasks', getTasks);
router.get('/get_task_by_id/:id', getTask);
router.put('/update_task_by_id/:id', updateTask);
router.delete('/delete_task/:id', deleteTask);

module.exports = router;
