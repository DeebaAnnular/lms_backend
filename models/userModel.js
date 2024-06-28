const db = require("../config/db");
class User {
 
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE work_email = ?", [email]);
    if (rows.length > 0) {
      const user = rows[0];
      return {
        userId: user.user_id,
        ...user
      };
    }
    return null;
  }

  static create(user) {
    console.log("Date being inserted:", user.date_of_joining); // Log the date right before insertion
    return db.execute(
      "INSERT INTO users (emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, personal_email, work_email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.emp_id,
        user.emp_name,
        user.gender,
        user.date_of_joining,
        user.contact_number,
        user.work_location,
        user.active_status,
        user.designation,
        user.personal_email,
        user.work_email,
        user.password,
      ]
    );
  }
  static updatePassword(work_email, newPassword) {
    return db.execute(
      "UPDATE users SET password = ? WHERE work_email = ?"[
        (newPassword, work_email)
      ]
    );
  }

  static getAllUsers() {
    return db.execute(
      "SELECT user_id, emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, personal_email, work_email, created_at, updated_at FROM users"
    );
  }

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
    console.log("Fetching leave balance for userId:", parsedUserId);
    return db.execute("SELECT * FROM leaves WHERE user_id = ?", [parsedUserId]);
  }

  static async updateLeaveBalance(userId, leaveBalances) {
    // Ensure userId is not undefined
    if (userId === undefined) {
      throw new Error("User ID is required");
    }

    // Destructure with default values
    const {
      earned_leave = null,
      sick_leave = null,
      maternity_leave = null,
      optional_leave = null,
    } = leaveBalances;

    try {
      // First, check if a record exists for this user
      const [existingRecord] = await db.execute(
        "SELECT leave_id, earned_leave, sick_leave, maternity_leave, optional_leave FROM leaves WHERE user_id = ?",
        [userId]
      );

      let result;
      if (existingRecord.length === 0) {
        // If no record exists, insert a new one
        result = await db.execute(
          `INSERT INTO leaves (user_id, earned_leave, sick_leave, maternity_leave, optional_leave)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, earned_leave, sick_leave, maternity_leave, optional_leave]
        );
      } else {
        // Get existing values if provided value is null
        const existingLeaves = existingRecord[0];

        result = await db.execute(
          `UPDATE leaves 
           SET earned_leave = COALESCE(?, earned_leave),
               sick_leave = COALESCE(?, sick_leave),
               maternity_leave = COALESCE(?, maternity_leave),
               optional_leave = COALESCE(?, optional_leave)
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
}

module.exports = User;
