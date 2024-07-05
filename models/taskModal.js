const db = require("../config/db");
class EmployeeTask {
  static createTask = async (task) => {
    const [rows] = await db.query(
      `INSERT INTO tasks (task_name, task_time, task_date, user_id, created_at, updated_at) 
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [task.task_name, task.task_time, task.task_date, task.user_id]
    );
    return rows;
  };

  static getTasks = async () => {
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
}

module.exports = EmployeeTask;
