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

  static create(user) {
    console.log("Date being inserted:", user.date_of_joining);
    return db.execute(
      "INSERT INTO users (emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, role, work_email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.emp_id,
        user.emp_name,
        user.gender,
        user.date_of_joining,
        user.contact_number,
        user.work_location,
        user.active_status,
        user.designation,
        user.role,
        user.work_email,
        user.password,
      ]
    );
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
      "SELECT user_id, emp_id, emp_name, gender, date_of_joining, contact_number, work_location, active_status, designation, role, work_email, created_at, updated_at FROM users WHERE user_id = ?",
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

  static async updateUser(userId, userData) {
    try {
      // Check if emp_id is already used by another user
      const checkQuery = `SELECT user_id FROM users WHERE emp_id = ? AND user_id != ?`;
      const [rows] = await db.execute(checkQuery, [userData.emp_id, userId]);

      if (rows.length > 0) {
        return {
          success: false,
          message: "Duplicate emp_id. Please use a unique emp_id.",
        };
      }

      // Proceed with the update if no duplicate found
      const query = `
        UPDATE users
        SET emp_id = ?, emp_name = ?, gender = ?, date_of_joining = ?, contact_number = ?,
            work_location = ?, active_status = ?, designation = ?, role =?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;

      const values = [
        userData.emp_id,
        userData.emp_name,
        userData.gender,
        userData.date_of_joining,
        userData.contact_number,
        userData.work_location,
        userData.active_status,
        userData.designation,
        userData.role,
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
