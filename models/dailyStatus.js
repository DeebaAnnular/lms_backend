const db = require('../config/db');

const DailyStatus = {
  create: (date, userId, callback) => {
    const query = 'INSERT INTO Daily_status (date, user_id) VALUES (?, ?)';
    db.query(query, [date, userId], callback);
  },

  findByDateAndUser: (date, userId, callback) => {
    const query = 'SELECT * FROM Daily_status WHERE date = ? AND user_id = ?';
    db.query(query, [date, userId], callback);
  },

  updateTotalDuration: (dateId, callback) => {
    const query = `
      UPDATE Daily_status 
      SET total_duration = (
        SELECT COALESCE(SUM(task_duration), 0) 
        FROM Task 
        WHERE date_id = ?
      )
      WHERE date_id = ?
    `;
    db.query(query, [dateId, dateId], callback);
  }
};

module.exports = DailyStatus;