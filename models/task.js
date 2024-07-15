const db = require('../config/db');

const Task = {
  create: (taskData, callback) => {
    const query = 'INSERT INTO Task (task_name, task_duration, user_id, date_id) VALUES (?, ?, ?, ?)';
    db.query(query, [taskData.task_name, taskData.task_duration, taskData.user_id, taskData.date_id], callback);
  },

  update: (id, taskData, callback) => {
    const query = 'UPDATE Task SET task_name = ?, task_duration = ? WHERE task_id = ?';
    db.query(query, [taskData.task_name, taskData.task_duration, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Task WHERE task_id = ?';
    db.query(query, [id], callback);
  },

  getByDateId: (dateId, callback) => {
    const query = 'SELECT * FROM Task WHERE date_id = ?';
    db.query(query, [dateId], callback);
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM Task WHERE task_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  }
};

module.exports = Task;