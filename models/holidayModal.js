const db = require('../config/db'); // Assuming you have a database configuration file
const { format } = require("date-fns");

class HolidayRequest {
  static async create(holidayRequest) {
    const { date, holiday_type, description } = holidayRequest;
    const [result] = await db.query(
      `INSERT INTO holiday_requests (date, holiday_type, description) VALUES (?, ?, ?)`,
      [date, holiday_type, description]
    );
    console.log("Insertion result:", result);
    return { insertId: result.insertId };
  }

  static async getByHolidayType(holiday_type) {
    const [rows] = await db.query(`SELECT * FROM holiday_requests WHERE holiday_type = ?`, [holiday_type]);
    const formattedRows = rows.map(row => ({
      ...row,
      date: format(new Date(row.date), 'yyyy-MM-dd')
    }));
    return formattedRows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM holiday_requests WHERE holiday_id = ?', [id]);
    if (rows.length > 0) {
      rows[0].date = format(new Date(rows[0].date), 'yyyy-MM-dd');
      return rows[0];
    }
    return null;
  }

  static async findByDate(date) {
    const [rows] = await db.query('SELECT * FROM holiday_requests WHERE date = ?', [date]);
    if (rows.length > 0) {
      rows[0].date = format(new Date(rows[0].date), 'yyyy-MM-dd');
      return rows[0];
    }
    return null;
  }

  static async getAllHolidays() {
    const [rows] = await db.query(`SELECT * FROM holiday_requests`);
    const formattedRows = rows.map(row => ({
      ...row,
      date: format(new Date(row.date), 'yyyy-MM-dd')
    }));
    return formattedRows;
  }

  static async updateById(id, holidayRequest) {
    const { date, holiday_type, description } = holidayRequest;
    const [result] = await db.query(
      `UPDATE holiday_requests SET date = ?, holiday_type = ?, description = ? WHERE holiday_id = ?`,
      [date, holiday_type, description, id]
    );
    return result;
  }

  static async deleteById(id) {
    const [result] = await db.query(`DELETE FROM holiday_requests WHERE holiday_id = ?`, [id]);
    return result;
  }
}

module.exports = HolidayRequest;
