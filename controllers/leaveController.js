const User = require("../models/userModel");
// Apply for leave
exports.applyLeave = async (req, res) => {
    try {
      const { userId, leaveType, days } = req.body;
      await User.applyLeave(userId, leaveType, days);
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
      console.log(" userId:", userID );
      
      const [leaveBalance] = await User.getLeaveBalance(userID);
      
      console.log("Leave balance result:", leaveBalance);
      
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
      await User.updateLeaveBalance(userId, leaveBalances);
      
      res.status(200).json({
        userId, 
        leaveBalances,
         message: "Leave balance updated successfully" });
    } catch (error) {
      console.error("Error updating leave balance:", error);
      res.status(500).json({ message: "Error updating leave balance", error: error.message });
    }
  };