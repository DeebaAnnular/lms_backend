const db = require("../config/db");
const pool = require("../config/db");

class EmployeeTask {
  static createTask = async (task) => {
    const [rows] = await db.query(
      `INSERT INTO tasks (task_name, task_time, task_date, user_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [task.task_name, task.task_time, task.task_date, task.user_id]
    );
    return rows;
  };

  static getAllTasks = async () => {
    const [rows] = await db.query("SELECT * FROM tasks");
    return rows;
  };

  static getTaskById = async (id) => {
    const [rows] = await db.query("SELECT * FROM tasks WHERE task_id = ?", [
      id,
    ]);
    return rows[0];
  };

  static updateTask = async (id, task) => {
    const [rows] = await db.query(
      `UPDATE tasks 
       SET task_name = ?, task_time = ?, task_date = ?, user_id = ?, updated_at = NOW() 
       WHERE task_id = ?`,
      [task.task_name, task.task_time, task.task_date, task.user_id, id]
    );
    return rows;
  };

  static deleteTask = async (id) => {
    const [rows] = await db.query("DELETE FROM tasks WHERE task_id = ?", [id]);
    return rows;
  };

  static getWeeklyData = async (userId, fromDate, toDate) => {
    try {
      console.log("data: ", userId, fromDate, toDate);

      const query = `
        SELECT 
          DATE_FORMAT(task_date, '%d-%m-%Y') AS day,
          GROUP_CONCAT(task_id SEPARATOR ',') AS task_id,
          GROUP_CONCAT(task_name SEPARATOR ',') AS task_name,
          SUM(TIME_TO_SEC(task_time) / 3600) AS total_hours_per_day
        FROM 
          tasks
        WHERE 
          user_id = ?
          AND task_date BETWEEN ? AND ?
        GROUP BY 
          task_date
        ORDER BY 
          task_date
      `;
      console.log("Executing query:", query);
      console.log("Query parameters:", [userId, fromDate, toDate]);

      const [results] = await db.query(query, [userId, fromDate, toDate]);
      console.log("Query results:", results);

      return results;
    } catch (error) {
      console.error("Error in getWeeklyData:", error);
      throw error;
    }
  };

  // create weekly status
  static async createWeeklyStatus(userId, fromDate, toDate) {
    try {
      const query = `
        INSERT INTO Weekly_status (user_id, from_date, to_date)
        VALUES (?, ?, ?)
      `;

      const [result] = await db.query(query, [userId, fromDate, toDate]);
      return result.insertId;
    } catch (error) {
      console.error("Error in createWeeklyStatus:", error);
      throw error;
    }
  }

  // *********
  static async getWeeklyStatusById(weekId) {
    try {
      const query = "SELECT * FROM Weekly_status WHERE week_id = ?";

      const [results] = await db.query(query, [weekId]);
      return results[0];
    } catch (error) {
      console.error("Error in getWeeklyStatusById:", error);
      throw error;
    }
  }

  static async updateWeeklyStatusToApproved(weekId, approvedBy) {
    try {
      const query = `
        UPDATE Weekly_status
        SET status = 'approved', approved_by = ?
        WHERE week_id = ?
      `;

      const [result] = await db.query(query, [approvedBy, weekId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in updateWeeklyStatusToApproved:", error);
      throw error;
    }
  }

  static async updateWeeklyStatusToRejected(weekId, comment, approvedBy) {
    try {
      const query = `
        UPDATE Weekly_status
        SET status = 'rejected', comment = ?, approved_by = ?
        WHERE week_id = ?
      `;

      const [result] = await db.query(query, [comment, approvedBy, weekId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in updateWeeklyStatusToRejected:", error);
      throw error;
    }
  }

  static async getAllWeeklyStatuses() {
    try {
      const query = `
        SELECT ws.*, u.emp_name AS user_name
        FROM Weekly_status ws
        JOIN users u ON ws.user_id = u.user_id
      `;
      const [results] = await db.query(query);
      return results;
    } catch (error) {
      console.error("Error in getAllWeeklyStatuses:", error);
      throw error;
    }
  }
}
module.exports = EmployeeTask;
