const db = require("../config/db");
class RoleManagerHistory {
  // Method to save a new record to the roleManagerHistory table
  // Method to save a new record to the roleManagerHistory table with a check for previous active record
  static async saveRoleManagerHistory(
    userId,
    effective_from,
    effectiveTill,
    IsActive,
    createdBy,
    rmUserId
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Step 1: Check if there's an existing active record for the user
      const [existingRecord] = await connection.query(
        `SELECT id FROM roleManagerHistory WHERE userId = ? AND IsActive = true ORDER BY effective_from DESC LIMIT 1`,
        [userId]
      );

      // Step 2: If an active record exists, set its IsActive to false
      if (existingRecord && existingRecord.length > 0) {
        await connection.query(
          `UPDATE roleManagerHistory SET IsActive = false WHERE id = ?`,
          [existingRecord[0].id]
        );
      }

      // Step 3: Insert the new record with IsActive set to true
      const query = `
      INSERT INTO roleManagerHistory (userId, effective_from, effectiveTill, IsActive, createdBy, rmUserId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
      const [result] = await connection.query(query, [
        userId,
        effective_from,
        effectiveTill || null, // If effectiveTill is not provided, it will be set to null
        IsActive || true, // If IsActive is not provided, it will be set to true
        createdBy,
        rmUserId,
      ]);

      // Commit the transaction
      await connection.commit();

      return result.insertId; // Return the ID of the newly inserted record
    } catch (error) {
      // Rollback the transaction if any error occurs
      await connection.rollback();
      console.error("Error saving role manager history:", error);
      throw error; // Throw error to be handled in the controller
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  }

  // Method to get role manager history by userId
  static async getRoleManagerHistoryByUserId(userId) {
    const query = `
    SELECT 
      rmh.*, 
      u.emp_name AS createdByName
    FROM 
      roleManagerHistory rmh
    JOIN 
      users u 
    ON 
      rmh.createdBy = u.user_id
    WHERE 
      rmh.userId = ?
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
