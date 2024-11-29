const db = require("../config/db");
class EmployeeLeave {
  static async applyLeave(userId, leaveType, days) {
    const validLeaveTypes = [
      "earned_leave",
      "sick_leave",
      "maternity_leave",
      "optional_leave",
    ];

    if (!validLeaveTypes.includes(leaveType)) {
      throw new Error("Invalid leave type");
    }

    // Construct the query dynamically but safely
    const query = `
      UPDATE leaves 
      SET ${leaveType} = ${leaveType} - ? 
      WHERE user_id = ? AND ${leaveType} >= ?
    `;

    try {
      const [result] = await db.execute(query, [days, userId, days]);

      if (result.affectedRows === 0) {
        throw new Error("Insufficient leave balance or invalid user ID");
      }

      return result;
    } catch (error) {
      console.error("Error in applyLeave:", error);
      throw error;
    }
  }

  static getLeaveBalance(userId) {
    const parsedUserId = parseInt(userId);
    return db.execute("SELECT * FROM leaves WHERE user_id = ?", [parsedUserId]);
  }

  static async getCurrentLeaveBalance(userId) {
    const query =
      "SELECT earned_leave, sick_leave, maternity_leave, optional_leave, loss_of_pay, work_from_home FROM leaves WHERE user_id = ?";
    try {
      const [rows] = await db.execute(query, [userId]);
      if (rows.length === 0) {
        throw new Error("Leave balance not found for user");
      }
      return rows[0];
    } catch (error) {
      console.error("Error in getCurrentLeaveBalance:", error);
      throw error;
    }
  }

  static async updateLeaveRequestStatus(requestId, status, reason = null) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Invalid status. Must be 'approved' or 'rejected'.");
    }

    let query = "UPDATE leave_requests SET status = ?";
    const queryParams = [status];

    if (reason !== null) {
      query += ", reason = ?";
      queryParams.push(reason);
    }

    query += " WHERE id = ?";
    queryParams.push(requestId);

    try {
      const [result] = await db.execute(query, queryParams);
      if (result.affectedRows === 0) {
        throw new Error("Leave request not found or already processed");
      }
      return this.getLeaveRequestDetails(requestId);
    } catch (error) {
      console.error("Error in updateLeaveRequestStatus:", error);
      throw error;
    }
  }
  static async updateLeaveBalance(userId, leaveBalances) {
    console.log("Updating leave balance for user:", userId);
    console.log("Leave balances:", leaveBalances);

    // Ensure userId is not undefined
    if (userId === undefined) {
      throw new Error("User ID is required");
    }

    // Validate leave types
    const validLeaveTypes = [
      "earned_leave",
      "sick_leave",
      "maternity_leave",
      "optional_leave",
      "loss_of_pay",
      "work_from_home",
    ];

    for (const leaveType in leaveBalances) {
      if (!validLeaveTypes.includes(leaveType)) {
        console.log("Invalid leave type detected:", leaveType);
        throw new Error("Invalid leave type");
      }
    }

    // Destructure with default values
    const {
      earned_leave = null,
      sick_leave = null,
      maternity_leave = null,
      optional_leave = null,
      loss_of_pay = null,
      work_from_home = null,
    } = leaveBalances;

    try {
      // First, check if a record exists for this user
      const [existingRecord] = await db.execute(
        "SELECT leave_id, earned_leave, sick_leave, maternity_leave, optional_leave, loss_of_pay, work_from_home FROM leaves WHERE user_id = ?",
        [userId]
      );

      console.log("Existing record:", existingRecord);

      let result;
      if (existingRecord.length === 0) {
        console.log("No existing record, inserting new one");
        // If no record exists, insert a new one
        result = await db.execute(
          `INSERT INTO leaves (user_id, earned_leave, sick_leave, maternity_leave, optional_leave, loss_of_pay, work_from_home)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            earned_leave,
            sick_leave,
            maternity_leave,
            optional_leave,
            loss_of_pay,
            work_from_home,
          ]
        );
      } else {
        console.log("Existing record found, updating");
        // Get existing values if provided value is null
        const existingLeaves = existingRecord[0];

        result = await db.execute(
          `UPDATE leaves
           SET earned_leave = COALESCE(?, earned_leave),
               sick_leave = COALESCE(?, sick_leave),
               maternity_leave = COALESCE(?, maternity_leave),
               optional_leave = COALESCE(?, optional_leave),
               loss_of_pay = COALESCE(?, loss_of_pay),
               work_from_home = COALESCE(?, work_from_home)
           WHERE user_id = ?`,
          [
            earned_leave !== null ? earned_leave : existingLeaves.earned_leave,
            sick_leave !== null ? sick_leave : existingLeaves.sick_leave,
            maternity_leave !== null
              ? maternity_leave
              : existingLeaves.maternity_leave,
            optional_leave !== null
              ? optional_leave
              : existingLeaves.optional_leave,
            loss_of_pay !== null ? loss_of_pay : existingLeaves.loss_of_pay,
            work_from_home !== null
              ? work_from_home
              : existingLeaves.work_from_home,
            userId,
          ]
        );
      }

      console.log("Update result:", result);

      if (result.affectedRows === 0) {
        throw new Error("Failed to update leave balance");
      }

      return result;
    } catch (error) {
      console.error("Error in updateLeaveBalance:", error);
      throw error;
    }
  }

  //   ************ create leave request
  static async createLeaveRequest(
    userId,
    empName,
    fromDate,
    toDate,
    session,
    totalDays,
    leaveType,
    reason
  ) {
    // Validate inputs
    if (
      !userId ||
      !empName ||
      !fromDate ||
      !toDate ||
      !totalDays ||
      !leaveType ||
      !reason
    ) {
      throw new Error("All fields are required for creating a leave request");
    }

    const query = `
    INSERT INTO leave_requests (user_id, emp_name, from_date, to_date, session, total_days, leave_type, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?,?)
  `;

    try {
      const [result] = await db.execute(query, [
        userId,
        empName,
        fromDate,
        toDate,
        session,
        totalDays,
        leaveType,
        reason,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("Error in createLeaveRequest:", error);
      throw error;
    }
  }

  // ******** chech leave date already exist ***********

  static async checkExistingLeaveRequest(userId, fromDate, toDate, session) {
    const query = `
        SELECT *
        FROM leave_requests
        WHERE user_id = ?
        AND status != 'rejected'
        AND (
            (from_date <= ? AND to_date >= ?) OR 
            (from_date >= ? AND from_date <= ?)
        )
    `;
    try {
      const [rows] = await db.execute(query, [
        userId,
        fromDate,
        toDate,
        fromDate,
        toDate,
      ]);

      // Check for leave requests on the same date range
      const existingLeaves = rows.filter(
        (row) =>
          new Date(row.from_date).toDateString() ===
            new Date(fromDate).toDateString() &&
          new Date(row.to_date).toDateString() ===
            new Date(toDate).toDateString()
      );

      if (existingLeaves.length > 0) {
        // Case 1: Full day leave already exists
        if (existingLeaves.some((leave) => leave.session === "full_day")) {
          return {
            conflict: true,
            message:
              "A full day leave request already exists for the specified date.",
          };
        }

        // Case 2: Applying for a session that already exists
        if (
          session !== "full_day" &&
          existingLeaves.some((leave) => leave.session === session)
        ) {
          return {
            conflict: true,
            message: `A leave request for ${session} session already exists on this date.`,
          };
        }

        // Case 3: Both AN and FN sessions are already applied
        if (session !== "full_day" && existingLeaves.length === 2) {
          return {
            conflict: true,
            message:
              "Both AN and FN sessions are already applied for this date.",
          };
        }

        // Case 4: Applying full day when a half-day already exists
        if (session === "full_day" && existingLeaves.length > 0) {
          return {
            conflict: true,
            message: "Leave already exists for this date. Cannot apply leave.",
          };
        }
      }

      // Check for overlapping leave requests on different dates
      const hasConflictingLeave = rows.some(
        (row) =>
          new Date(row.from_date) <= new Date(toDate) &&
          new Date(row.to_date) >= new Date(fromDate) &&
          !(
            new Date(row.from_date).toDateString() ===
              new Date(fromDate).toDateString() &&
            new Date(row.to_date).toDateString() ===
              new Date(toDate).toDateString()
          )
      );

      if (hasConflictingLeave) {
        return {
          conflict: true,
          message: "A leave request overlaps with the specified date range.",
        };
      }

      return { conflict: false };
    } catch (error) {
      console.error("Error in checkExistingLeaveRequest:", error);
      throw error;
    }
  }
  // ********** get pending leave request

  static async getPendingLeaveRequests() {
    const query = "SELECT * FROM leave_requests WHERE status = 'pending'";
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("Error in getPendingLeaveRequests:", error);
      throw error;
    }
  }

  // ******** update leave request status
  static async updateLeaveRequestStatus(requestId, status) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Invalid status. Must be 'approved' or 'rejected'.");
    }

    const query =
      "UPDATE leave_requests SET status = ? WHERE leave_request_id = ?";
    try {
      const [result] = await db.execute(query, [status, requestId]);
      if (result.affectedRows === 0) {
        throw new Error("Leave request not found or already processed");
      }
      return this.getLeaveRequestDetails(requestId);
    } catch (error) {
      console.error("Error in updateLeaveRequestStatus:", error);
      throw error;
    }
  }

  //   ***********get leave request details

  static async getLeaveRequestDetails(requestId) {
    const query =
      "SELECT leave_request_id, user_id, emp_name, from_date, to_date, total_days, leave_type, session, status, reason, created_at, updated_at FROM leave_requests WHERE leave_request_id = ?";
    try {
      const [rows] = await db.execute(query, [requestId]);
      if (rows.length === 0) {
        throw new Error("Leave request not found");
      }
      return rows[0];
    } catch (error) {
      console.error("Error in getLeaveRequestDetails:", error);
      throw error;
    }
  }

  // user leave history by id
  static async getLeaveHistoryByUserId(userId) {
    // Validate input parameters
    if (!Number.isInteger(userId)) {
      throw new Error("Invalid input types for userId, limit, or offset");
    }

    const query = `
    SELECT 
      leave_request_id, 
      user_id, 
      emp_name, 
      from_date, 
      to_date, 
      total_days, 
      leave_type, 
      status, 
      reason, 
      created_at, 
      updated_at 
    FROM 
      leave_requests 
    WHERE 
      user_id = ? 
   
  `;

    try {
      // Execute the query with the provided parameters
      const [rows] = await db.execute(query, [userId]);

      // If no rows are returned, throw an error
      if (rows.length === 0) {
        throw new Error("Leave request not found");
      }

      // Return the fetched rows
      return rows;
    } catch (error) {
      // Log the error and rethrow it
      console.error("Error in getLeaveHistoryByUserId:", error);
      throw error;
    }
  }

  static async getAllApprovedAndRejectedRequests() {
    const query = `
      SELECT 
        lr.leave_request_id, 
        lr.user_id, 
        u.emp_id, 
        lr.emp_name, 
        lr.from_date, 
        lr.to_date, 
        lr.total_days, 
        lr.leave_type, 
        lr.status, 
        lr.reason, 
        lr.created_at, 
        lr.updated_at 
      FROM 
        leave_requests lr
      INNER JOIN 
        users u 
      ON 
        lr.user_id = u.user_id
      WHERE 
        lr.status IN ('rejected', 'approved')
    `;

    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("Error in getAllRejectedAndApprovedRequests:", error);
      throw error;
    }
  }
}

module.exports = EmployeeLeave;
