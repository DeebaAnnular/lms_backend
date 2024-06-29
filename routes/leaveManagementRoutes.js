const express = require("express");
const {
  applyLeave,
  getLeaveBalance,
  updateLeaveBalance,
  createLeaveRequest,
  getPendingLeaveRequests,
  approveOrRejectLeave
} = require("../controllers/leaveController");

const router = express.Router();

//leave management routes
router.post("/apply-leave", applyLeave);
router.get("/leave-balance/:userId", getLeaveBalance);
router.post("/update-leave-balance", updateLeaveBalance);
router.post("/request-leave", createLeaveRequest);
router.get("/get-all-leave-request", getPendingLeaveRequests);
router.put("/update-leave-status", approveOrRejectLeave);

module.exports = router;
