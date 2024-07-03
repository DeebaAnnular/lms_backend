const express = require("express");
const {
  getLeaveBalance,
  updateLeaveBalance,
  createLeaveRequest,
  getPendingLeaveRequests,
  approveOrRejectLeave,
  getLeaveHistory 
} = require("../controllers/leaveController");

const router = express.Router();

//leave management routes
// router.post("/apply-leave", applyLeave);
router.get("/leave-balance/:userId", getLeaveBalance);
router.post("/update-leave-balance", updateLeaveBalance); /*done */
router.post("/request-leave", createLeaveRequest); /*done */
router.get("/get-all-leave-request", getPendingLeaveRequests);  /*done */
router.put("/update-leave-status", approveOrRejectLeave);
router.get('/leave-history/:userId', getLeaveHistory); /*done */

module.exports = router;
