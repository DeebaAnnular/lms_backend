const db = require("../config/db");

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE work_email = ?",
      [email]
    );
    if (rows.length > 0) {
      const user = rows[0];
      return {
        userId: user.user_id,
        empName: user.emp_name,
        empId: user.emp_id,
        userRole: user.role,
        ...user,
      };
    }
    return null;
  }

  static async findByEmpId(emp_id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE emp_id = ?", [
      emp_id,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      return {
        userId: user.user_id,
        empName: user.emp_name,
        empId: user.emp_id,
        userRole: user.role,
        ...user,
      };
    }
    return null;
  }

  static async create(user) {
    // Check if the contact number is already used
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE contact_number = ?",
      [user.contact_number]
    );
    if (existingUsers.length > 0) {
      throw new Error(
        "Contact number already exists. Please use a unique number."
      );
    }

    // Insert the new user
    console.log("Date being inserted:", user.date_of_joining);
    return db.execute(
      "INSERT INTO users (emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, roleId, work_email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.emp_id,
        user.emp_name,
        user.gender,
        user.date_of_joining,
        user.contact_number,
        user.work_location,
        user.active_status,
        user.designation,
        user.roleId,
        user.work_email,
        user.password,
      ]
    );
  }

  static async deleteUser(userId) {
    try {
      const query = "DELETE FROM users WHERE user_id = ?";
      const [result] = await db.execute(query, [userId]);
      if (result.affectedRows > 0) {
        return { success: true, message: "Deleted Successfully." };
      } else {
        return { success: false, message: "User not found." };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static updatePassword(work_email, newPassword) {
    return db.execute("UPDATE users SET password = ? WHERE work_email = ?", [
      newPassword,
      work_email,
    ]);
  }

  static getAllUsers() {
    return db.execute(
      "SELECT user_id, emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, role, work_email, created_at, updated_at FROM users"
    );
  }

  static getUserDetailsById(userId) {
    return db.execute(
      "SELECT user_id, emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, roleId, work_email, created_at, updated_at FROM users WHERE user_id = ?",
      [userId]
    );
  }

  static async findById(userId) {
    const query = "SELECT * FROM users WHERE user_id = ?";
    try {
      const [rows] = await db.execute(query, [userId]);
      if (rows.length > 0) {
        const user = rows[0];
        return {
          userId: user.user_id,
          empName: user.emp_name,
          userRole: user.role,
          ...user,
        };
      }
      return null;
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  static async findByContactNumber(contactNumber) {
    const query = "SELECT * FROM users WHERE contact_number = ?";
    const [rows] = await db.execute(query, [contactNumber]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  }

  static async updateRole(userId, newRole) {
    const query = "UPDATE users SET role = ? WHERE user_id = ?";
    try {
      const [result] = await db.execute(query, [newRole, userId]);
      return result.affectedRows > 0; // Returns true if at least one row was affected
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  static async updateUserDetails(userId, userData) {
    try {
      // Fetch the current emp_id for the user
      const currentEmpIdQuery = `SELECT emp_id FROM users WHERE user_id = ?`;
      const [currentEmpIdRows] = await db.execute(currentEmpIdQuery, [userId]);

      if (currentEmpIdRows.length === 0) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      const currentEmpId = currentEmpIdRows[0].emp_id;

      // Check if a new emp_id is provided and it's different from the current one
      if (userData.emp_id && userData.emp_id !== currentEmpId) {
        // Check if the new emp_id is already used by another user
        const checkQuery = `SELECT user_id FROM users WHERE emp_id = ? AND user_id != ?`;
        const [rows] = await db.execute(checkQuery, [userData.emp_id, userId]);

        if (rows.length > 0) {
          return {
            success: false,
            message: "Duplicate emp_id. Please use a unique emp_id.",
          };
        }
      }

      // Proceed with the update
      const query = `
        UPDATE users
        SET emp_id = ?, emp_name = ?, gender = ?, date_of_joining = ?, contact_number = ?,
            work_location = ?, active_status = ?, designation = ?, roleId = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;

      const values = [
        userData.emp_id || currentEmpId, // Use current emp_id if not provided
        userData.emp_name,
        userData.gender,
        userData.date_of_joining,
        userData.contact_number,
        userData.work_location,
        userData.active_status,
        userData.designation,
        userData.roleId,
        userId,
      ];

      const [result] = await db.execute(query, values);
      if (result.affectedRows > 0) {
        return { success: true, message: "User details updated successfully." };
      } else {
        return {
          success: false,
          message: "User not found or no changes made.",
        };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
module.exports = User;
