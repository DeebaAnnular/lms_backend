const express = require("express");
const {
  applyLeave,
  getLeaveBalance,
  updateLeaveBalance,
} = require("../controllers/leaveController");


const router = express.Router();

//leave management routes
router.post('/apply-leave', applyLeave);
router.get('/leave-balance/:userId', getLeaveBalance);
router.post('/update-leave-balance', updateLeaveBalance);

module.exports = router;
