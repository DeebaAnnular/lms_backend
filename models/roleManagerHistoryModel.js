const db = require("../config/db");
class RoleManagerHistory {
  // Method to save a new record to the roleManagerHistory table
  static async saveRoleManagerHistory(
    userId,
    effective_from,
    effectiveTill,
    IsActive,
    createdBy,
    roleId
  ) {
    const query = `
      INSERT INTO roleManagerHistory (userId, effective_from, effectiveTill, IsActive, createdBy, roleId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(query, [
        userId,
        effective_from,
        effectiveTill || null, // If effectiveTill is not provided, it will be set to null
        IsActive || true, // If IsActive is not provided, it will be set to true
        createdBy,
        roleId,
      ]);

      return result.insertId; // Return the ID of the newly inserted record
    } catch (error) {
      console.error("Error saving role manager history:", error);
      throw error; // Throw error to be handled in the controller
    }
  }

  // Method to get role manager history by userId
  static async getRoleManagerHistoryByUserId(userId) {
    const query = `
    SELECT * FROM roleManagerHistory WHERE userId = ?
  `;

    try {
      const [result] = await db.query(query, [userId]);
      return result; // Return an array of records
    } catch (error) {
      console.error("Error fetching role manager history by userId:", error);
      throw error; // Throw error to be handled in the controller
    }
  }

  // Method to get role manager history by userId
  static async getRoleManagerHistoryByUserId(userId) {
    const query = `
    SELECT * FROM roleManagerHistory WHERE userId = ?
  `;

    try {
      const [result] = await db.query(query, [userId]);
      return result; // Return an array of records
    } catch (error) {
      console.error("Error fetching role manager history by userId:", error);
      throw error; // Throw error to be handled in the controller
    }
  }
}
module.exports = RoleManagerHistory;
