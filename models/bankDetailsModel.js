const db = require("../config/db");

class BankDetails {
  // Create a new bank detail entry
  static async createBankDetail(bankDetail) {
    const query = `
      INSERT INTO bankDetails (country, bankName, accountNumber, ifscCode, salaryAccount, uanNo, panNo, createdBy, updatedBy, userId, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      bankDetail.country,
      bankDetail.bankName,
      bankDetail.accountNumber,
      bankDetail.ifscCode,
      bankDetail.salaryAccount,
      bankDetail.uanNo,
      bankDetail.panNo,
      bankDetail.createdBy,
      bankDetail.updatedBy,
      bankDetail.userId,
      bankDetail.isActive || 1, // Default to active if not provided
    ];

    try {
      const [result] = await db.query(query, values);
      return result; // Return the inserted record
    } catch (error) {
      console.error("Error creating bank detail:", error);
      throw error; // Throw error to be handled by the controller
    }
  }

  static async updateBankDetail(bankId, updatedData) {
    const query = `
      UPDATE bankDetails
      SET country = ?, bankName = ?, accountNumber = ?, ifscCode = ?, salaryAccount = ?, 
          uanNo = ?, panNo = ?, updatedBy = ?, isActive = ?
      WHERE bankId = ?;
    `;
    const values = [
      updatedData.country,
      updatedData.bankName,
      updatedData.accountNumber,
      updatedData.ifscCode,
      updatedData.salaryAccount,
      updatedData.uanNo,
      updatedData.panNo,
      updatedData.updatedBy,
      updatedData.isActive, // Optionally set the isActive field
      bankId,
    ];

    try {
      const [result] = await db.query(query, values);
      return result; // Return the result of the update query
    } catch (error) {
      console.error("Error updating bank detail:", error);
      throw error;
    }
  }

  // Soft delete a bank detail entry (by setting isActive to false)
  static async deleteBankDetail(bankDetailId) {
    const query = `UPDATE bankDetails SET isActive = 0 WHERE bankId = ? AND isActive = 1`;
    try {
      const [result] = await db.query(query, [bankDetailId]);
      return result; // Return result indicating the number of rows affected (soft deleted)
    } catch (error) {
      console.error("Error soft deleting bank detail:", error);
      throw error;
    }
  }

  // Get bank details by userId
  static async getBankDetailsByUserId(userId) {
    const query = `SELECT * FROM bankDetails WHERE userId = ? AND isActive = 1`; // Only fetch active bank details
    try {
      const [result] = await db.query(query, [userId]);
      return result; // Return an array of records
    } catch (error) {
      console.error("Error fetching bank details by userId:", error);
      throw error;
    }
  }

  // Method to fetch the updated bank detail by ID
  static async getBankDetailById(bankId) {
    const query = "SELECT * FROM bankDetails WHERE bankId = ? AND isActive = 1"; // Only fetch active bank details
    const values = [bankId];

    try {
      const [rows] = await db.query(query, values);
      return rows[0]; // Return the updated record (if any)
    } catch (error) {
      console.error("Error fetching bank detail:", error);
      throw error;
    }
  }
}

module.exports = BankDetails;
