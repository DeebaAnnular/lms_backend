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
    try {
      // Check the current approval status of the task
      const [checkRows] = await db.query(
        `SELECT approved_status FROM tasks WHERE task_id = ?`,
        [id]
      );

      if (checkRows.length === 0) {
        throw new Error('Task not found');
      }

      const currentStatus = checkRows[0].approved_status;

      // If the task is already approved, do not allow updates
      if (currentStatus === 'approved') {
        throw new Error('Task is already approved and cannot be updated');
      }

      // Proceed with the update if the task is not approved
      const [rows] = await db.query(
        `UPDATE tasks 
         SET task_name = ?, task_time = ?, task_date = ?, user_id = ?, updated_at = NOW() 
         WHERE task_id = ?`,
        [task.task_name, task.task_time, task.task_date, task.user_id, id]
      );

      return rows;
    } catch (error) {
      console.error("Error in updateTask:", error);
      throw error;
    }
  };

  static deleteTask = async (id) => {
    const [rows] = await db.query("DELETE FROM tasks WHERE task_id = ?", [id]);
    return rows;
  };

  static getWeeklyData = async (userId, fromDate, toDate) => {
    try {
      const query = `
        SELECT 
          DATE_FORMAT(task_date, '%d-%m-%Y') AS day,
          GROUP_CONCAT(task_id SEPARATOR ',') AS task_id,
          GROUP_CONCAT(task_name SEPARATOR ',') AS task_name,
          SUM(TIME_TO_SEC(task_time) / 3600) AS total_hours_per_day,
          IF(COUNT(DISTINCT approved_status) = 1, MAX(approved_status), NULL) AS approved_status,
          IF(COUNT(DISTINCT approved_by_id) = 1, MAX(approved_by_id), NULL) AS approved_by_id,
          IF(COUNT(DISTINCT approved_by_id) = 1, (SELECT emp_name FROM users WHERE user_id = MAX(approved_by_id)), NULL) AS approved_by_name,
          IF(COUNT(DISTINCT reason) = 1, MAX(reason), NULL) AS reason
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
     
      const [results] = await db.query(query, [userId, fromDate, toDate]);    
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

  static updateApprovalStatus = async (approvedStatus, approvedById, taskIds) => {
    try {
      const query = `
        UPDATE tasks
        SET 
          approved_status = ?,
          approved_by_id = ?
        WHERE 
          task_id IN (?)
      `;
      
      const [results] = await db.query(query, [approvedStatus, approvedById, taskIds]);
      return results;
    } catch (error) {
      console.error("Error in updateApprovalStatus:", error);
      throw error;
    }
  };

  static updateRejectStatus = async (rejectedStatus, rejectedById, rejectReason, taskIds) => {
    try {
      const query = `
        UPDATE tasks
        SET 
          approved_status = ?,
          approved_by_id = ?,
          reason = ?
        WHERE 
          task_id IN (?)
      `;
      
      const [results] = await db.query(query, [rejectedStatus, rejectedById, rejectReason, taskIds]);
      return results;
    } catch (error) {
      console.error("Error in updateRejectStatus:", error);
      throw error;
    }
  };

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
