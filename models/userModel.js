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
}

module.exports = User;
