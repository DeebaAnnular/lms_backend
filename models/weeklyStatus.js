const db = require('../config/db');

const WeeklyStatus = {
  create: (userData, callback) => {
    const query = 'INSERT INTO Weekly_status (user_id, from_date, to_date) VALUES (?, ?, ?)';
    db.query(query, [userData.user_id, userData.from_date, userData.to_date], callback);
  },

  update: (id, data, callback) => {
    const query = 'UPDATE Weekly_status SET approved_status = ?, approved_by = ?, comment = ? WHERE week_id = ?';
    db.query(query, [data.approved_status, data.approved_by, data.comment, id], callback);
  },

  getByUserAndDateRange: (userId, startDate, endDate, callback) => {
    const query = `
      SELECT ws.*, 
             SUM(ds.total_duration) as total_week_duration
      FROM Weekly_status ws
      LEFT JOIN Daily_status ds ON ds.user_id = ws.user_id 
                                AND ds.date BETWEEN ws.from_date AND ws.to_date
      WHERE ws.user_id = ? AND ws.from_date >= ? AND ws.to_date <= ?
      GROUP BY ws.week_id
    `;
    db.query(query, [userId, startDate, endDate], callback);
  }
};

module.exports = WeeklyStatus;