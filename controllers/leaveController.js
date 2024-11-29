const nodemailer = require("nodemailer");
const EmployeeLeave = require("../models/leaveModal");
const User = require("../models/userModel");
const { validateLeaveBalances } = require("../utils/validateLeaveType");
// Apply for leave

// Get leave balance
exports.getLeaveBalance = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userID = parseInt(userId);

    const [leaveBalance] = await EmployeeLeave.getLeaveBalance(userID);

    if (leaveBalance && leaveBalance.length > 0) {
      res.status(200).json(leaveBalance[0]);
    } else {
      res
        .status(404)
        .json({ message: "Leave balance not found for this user" });
    }
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    res.status(500).json({
      message: "Error fetching leave balance",
      error: error.toString(),
    });
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
      message: "Leave balance updated successfully",
    });
  } catch (error) {
    console.error("Error updating leave balance:", error);
    res
      .status(500)
      .json({ message: "Error updating leave balance", error: error.message });
  }
};
// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "benishabeni21@gmail.com", // Sender email
    pass: "xhdj ysor pzul otkj", // Use app password or email password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendLeaveRequestEmail = async (email, leaveRequestDetails) => {
  if (!email) {
    console.error("No email provided");
    return; // Skip sending email if no recipient email is provided
  }

  const mailOptions = {
    from: "benishabeni21@gmail.com", // Sender address
    to: email, // Receiver's email address
    subject: "Leave Request Submitted Successfully", // Subject line
    text: `Dear ${leaveRequestDetails.emp_name},

Your leave request has been submitted successfully.

Leave Type: ${leaveRequestDetails.leave_type}

From Date: ${leaveRequestDetails.from_date}

To Date: ${leaveRequestDetails.to_date}

Total Day(s): ${leaveRequestDetails.total_days}

Session: ${leaveRequestDetails.session}

Reason: ${leaveRequestDetails.reason || "N/A"}

Approval Status: Pending

Regards,
Annular LMS Team
This is a system-generated mail, kindly do not reply to this. For any queries, contact your Reporting Manager.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Leave request email sent successfully");
  } catch (error) {
    console.error("Error sending leave request email:", error);
  }
};

// Apply for leave
exports.createLeaveRequest = async (req, res) => {
  try {
    const {
      user_id,
      from_date,
      to_date,
      session,
      total_days,
      leave_type,
      reason,
    } = req.body;

    // Validate that all required fields are present
    if (
      !user_id ||
      !from_date ||
      !to_date ||
      !total_days ||
      !leave_type ||
      !session
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch the user data first
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email exists
    if (!user.work_email) {
      return res.status(400).json({ message: "User email not found" });
    }

    // Check if leave dates are valid (e.g., from_date should not be after to_date)
    if (new Date(from_date) > new Date(to_date)) {
      return res
        .status(400)
        .json({ message: "From date cannot be after to date" });
    }

    // Check for existing leave requests and handle conflicts
    const { conflict, message } = await EmployeeLeave.checkExistingLeaveRequest(
      user_id,
      from_date,
      to_date,
      session
    );

    if (conflict) {
      return res.status(400).json({ message });
    }

    // Define leave types that require balance check
    const balanceCheckLeaveTypes = [
      "earned_leave",
      "sick_leave",
      "maternity_leave",
      "optional_leave",
    ];

    let newBalance;
    if (balanceCheckLeaveTypes.includes(leave_type)) {
      // Get current leave balance
      const currentBalance = await EmployeeLeave.getCurrentLeaveBalance(
        user_id
      );
      if (!currentBalance) {
        return res
          .status(404)
          .json({ message: "Current leave balance not found" });
      }

      // Calculate new balance
      newBalance = currentBalance[leave_type] - total_days;
      if (newBalance < 0) {
        return res.status(400).json({ message: "Insufficient leave balance" });
      }
    }

    // Create the leave request using the user's data
    const leaveRequestId = await EmployeeLeave.createLeaveRequest(
      user_id,
      user.emp_name,
      from_date,
      to_date,
      session,
      total_days,
      leave_type,
      reason
    );

    // Update leave balance only after the leave request is successfully created
    if (balanceCheckLeaveTypes.includes(leave_type)) {
      const leaveBalances = { [leave_type]: newBalance };
      await EmployeeLeave.updateLeaveBalance(user_id, leaveBalances);
    }

    // Send the leave request email after the request is successfully created
    await sendLeaveRequestEmail(user.work_email, {
      emp_name: user.emp_name,
      leave_type,
      from_date,
      to_date,
      total_days,
      session,
      reason,
    });

    // Respond with the leave request details
    res.status(201).json({
      message: "Leave request created successfully",
      leaveRequestId,
      leaveRequest: {
        user_id,
        emp_name: user.emp_name,
        from_date,
        to_date,
        session,
        total_days,
        leave_type,
        reason,
        status: "pending",
        new_balance: balanceCheckLeaveTypes.includes(leave_type)
          ? newBalance
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error in createLeaveRequest controller:", error);
    res
      .status(500)
      .json({ message: "Error creating leave request", error: error.message });
  }
};

exports.getPendingLeaveRequests = async (req, res) => {
  try {
    const requests = await EmployeeLeave.getPendingLeaveRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending leave requests",
      error: error.message,
    });
  }
};

// Updated approveOrRejectLeave method
exports.approveOrRejectLeave = async (req, res) => {
  try {
    const { leave_request_id, status, reason } = req.body;

    // Ensure leave_request_id is a number
    const requestId = parseInt(leave_request_id, 10);
    if (isNaN(requestId)) {
      throw new Error("Invalid leave_request_id");
    }

    // Get leave request details
    const leaveRequest = await EmployeeLeave.getLeaveRequestDetails(requestId);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Update leave request status and reason if rejected
    if (status === "rejected" && !reason) {
      return res
        .status(400)
        .json({ message: "Reason is required for rejection" });
    }

    await EmployeeLeave.updateLeaveRequestStatus(requestId, status, reason);

    // If rejected, add the total days back to the leave balance
    if (status === "rejected") {
      // Get current leave balance
      const currentBalance = await EmployeeLeave.getCurrentLeaveBalance(
        leaveRequest.user_id
      );
      if (!currentBalance) {
        return res
          .status(404)
          .json({ message: "Current leave balance not found" });
      }

      // Calculate new balance
      const newBalance =
        parseFloat(currentBalance[leaveRequest.leave_type]) +
        parseFloat(leaveRequest.total_days);

      // Prepare leave balance update
      const leaveBalances = {
        [leaveRequest.leave_type]: newBalance,
      };

      // Update leave balance
      await EmployeeLeave.updateLeaveBalance(
        leaveRequest.user_id,
        leaveBalances
      );
    }

    // Send email notification for approval or rejection
    const user = await User.findById(leaveRequest.user_id);
    if (user && user.work_email) {
      await sendLeaveApprovalOrRejectionEmail(
        user.work_email,
        leaveRequest,
        status,
        reason
      );
    } else {
      console.warn("User email not found; skipping email notification.");
    }

    res.json({ message: `Leave request ${status} successfully` });
  } catch (error) {
    console.error("Error in approveOrRejectLeave:", error);
    res.status(500).json({
      message: "Error updating leave request status",
      error: error.message,
    });
  }
};
const sendLeaveApprovalOrRejectionEmail = async (
  email,
  leaveRequestDetails,
  status,
  reason = ""
) => {
  if (!email) {
    console.error("No email provided");
    return; // Skip sending email if no recipient email is provided
  }
  // Log leaveRequestDetails to confirm the session field is present
  console.log("Leave Request Details:", leaveRequestDetails);

  const subject =
    status === "approved"
      ? "Your Leave Request has been Approved"
      : "Your Leave Request has been Rejected";

  const text =
    status === "approved"
      ? `Dear ${leaveRequestDetails.emp_name},

Congratulations! Your leave request has been approved.

Leave Type: ${leaveRequestDetails.leave_type}

From Date: ${leaveRequestDetails.from_date}

To Date: ${leaveRequestDetails.to_date}

Total Day(s): ${leaveRequestDetails.total_days}

Session: ${leaveRequestDetails.session}

Enjoy your leave!

Regards,
Annular LMS Team
This is a system-generated mail, kindly do not reply to this. For any queries, contact your Reporting Manager.`
      : `Dear ${leaveRequestDetails.emp_name},

Unfortunately, your leave request has been rejected.

Leave Type: ${leaveRequestDetails.leave_type}

From Date: ${leaveRequestDetails.from_date}

To Date: ${leaveRequestDetails.to_date}

Total Day(s): ${leaveRequestDetails.total_days}

Session: ${leaveRequestDetails.session}

Reason for Rejection: ${reason}

Regards,
Annular LMS Team
This is a system-generated mail, kindly do not reply to this. For any queries, contact your Reporting Manager.`;

  const mailOptions = {
    from: "benishabeni21@gmail.com", // Sender address
    to: email, // Receiver's email address
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Leave approval/rejection email sent successfully");
  } catch (error) {
    console.error("Error sending approval/rejection email:", error);
  }
};

exports.getLeaveHistory = async (req, res) => {
  try {
    // Parse userId from request parameters
    const userId = parseInt(req.params.userId);

    // Validate userId
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch leave history using the service method
    const leaveHistory = await EmployeeLeave.getLeaveHistoryByUserId(userId);

    // Respond with the leave history data and pagination info
    res.json({
      message: "Leave history retrieved successfully",
      data: leaveHistory,
    });
  } catch (error) {
    // Log the error and respond with an error message
    console.error("Error in getLeaveHistory:", error);
    res.status(500).json({
      message: "Error retrieving leave history",
      error: error.message,
    });
  }
};

exports.getAllApprovedAndRejectedRequests = async (req, res) => {
  try {
    const requests = await EmployeeLeave.getAllApprovedAndRejectedRequests();
    res.json(requests);
  } catch (error) {
    console.error("Error in getAllApprovedAndRejectedRequests:", error);
    res.status(500).json({
      message: "Error retrieving approved and rejected leave requests",
      error: error.message,
    });
  }
};
