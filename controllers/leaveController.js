const EmployeeLeave = require("../models/leaveModal");
const User = require("../models/userModel");
const { validateLeaveBalances } = require("../utils/validateLeaveType");
// Apply for leave
exports.applyLeave = async (req, res) => {
    try {
      const { userId, leaveType, days } = req.body;
      await EmployeeLeave.applyLeave(userId, leaveType, days);
      res.status(200).json({ message: "Leave applied successfully" });
    } catch (error) {
      console.error("Error applying leave:", error);
      res.status(500).json({ message: "Error applying leave", error: error.message });
    }
  };
  
  // Get leave balance
  exports.getLeaveBalance = async (req, res) => {
    try {
      const userId = req.params.userId;
     
      const userID = parseInt(userId)
     
      
      const [leaveBalance] = await EmployeeLeave.getLeaveBalance(userID);
      
      
      
      if (leaveBalance && leaveBalance.length > 0) {
        res.status(200).json(leaveBalance[0]);
      } else {
        res.status(404).json({ message: "Leave balance not found for this user" });
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      res.status(500).json({ message: "Error fetching leave balance", error: error.toString() });
    }
  };
  
  // Update leave balance (admin only)
  exports.updateLeaveBalance = async (req, res) => {
    try {
      const { userId, leaveBalances } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      if (!validateLeaveBalances(leaveBalances)) {
        return res.status(400).json({ message: "Invalid leave balance data" });
      }
      
      await EmployeeLeave.updateLeaveBalance(userId, leaveBalances);
      
      res.status(200).json({
        userId,
        leaveBalances,
        message: "Leave balance updated successfully"
      });
    } catch (error) {
      console.error("Error updating leave balance:", error);
      res.status(500).json({ message: "Error updating leave balance", error: error.message });
    }
  };
  exports.createLeaveRequest = async (req, res) => {
    try {
      const { user_id, from_date, to_date, total_days, leave_type } = req.body;
      
      // Validate that all required fields are present
      if (!user_id || !from_date || !to_date || !total_days || !leave_type) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Fetch the user data first
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Now create the leave request using the user's data
      const leaveRequestId = await EmployeeLeave.createLeaveRequest(user_id, user.emp_name, from_date, to_date, total_days, leave_type);
      
      res.status(201).json({
        message: "Leave request created successfully",
        leaveRequestId,
        leaveRequest: {
          user_id,
          emp_name: user.emp_name,
          from_date,
          to_date,
          total_days,
          leave_type,
          status: 'pending'
        }
      });
    } catch (error) {
      console.error("Error in createLeaveRequest controller:", error);
      res.status(500).json({ message: "Error creating leave request", error: error.message });
    }
  };
  
  exports.getPendingLeaveRequests = async (req, res) => {
    try {
      const requests = await EmployeeLeave.getPendingLeaveRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending leave requests", error: error.message });
    }
  };
  
  exports.approveOrRejectLeave = async (req, res) => {
    try {
      const { leave_request_id, status, reason } = req.body;
  
      console.log("leave_request_id:", leave_request_id, "type:", typeof leave_request_id);
      console.log("status:", status, "type:", typeof status);
  
      // Ensure leave_request_id is a number
      const requestId = parseInt(leave_request_id, 10);
      if (isNaN(requestId)) {
        throw new Error("Invalid leave_request_id");
      }
  
      // Get leave request details
      const leaveRequest = await EmployeeLeave.getLeaveRequestDetails(requestId);
  
      // Update leave request status and reason if rejected
      if (status === 'rejected' && !reason) {
        throw new Error("Reason is required for rejection");
      }
      await EmployeeLeave.updateLeaveRequestStatus(requestId, status, reason);
  
      // If approved, update leave balance
      if (status === 'approved') {
        // Get current leave balance
        const currentBalance = await EmployeeLeave.getCurrentLeaveBalance(leaveRequest.user_id);
        
        // Calculate new balance
        const newBalance = currentBalance[leaveRequest.leave_type] - leaveRequest.total_days;
        
        // Prepare leave balance update
        const leaveBalances = {
          [leaveRequest.leave_type]: newBalance
        };
        
        // Update leave balance
        await EmployeeLeave.updateLeaveBalance(leaveRequest.user_id, leaveBalances);
      }
  
      res.json({ message: `Leave request ${status} successfully` });
    } catch (error) {
      console.error("Error in approveOrRejectLeave:", error);
      res.status(500).json({ message: "Error updating leave request status", error: error.message });
    }
  };
