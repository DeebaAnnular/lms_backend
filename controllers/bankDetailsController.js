const BankDetails = require("../models/bankDetailsModel");

exports.createBankDetail = async (req, res) => {
  const bankDetail = req.body;

  try {
    // Step 1: Check if a record with the same userId already exists
    const existingBankDetail = await BankDetails.getBankDetailByUserId(
      bankDetail.userId
    );

    if (existingBankDetail) {
      return res.status(400).json({
        success: false,
        message: "Bank detail for this userId already exists.",
      });
    }

    // Step 2: If no existing record, insert the new bank detail
    const result = await BankDetails.createBankDetail(bankDetail);
    console.log("Result from createBankDetail:", result); // Log the result for debugging

    if (result && result.insertId) {
      res.status(201).json({
        success: true,
        message: "Bank detail created successfully.",
        data: { bankId: result.insertId }, // Use insertId as the bankId
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to retrieve bankId from the result.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating bank detail",
      error: error.message,
    });
  }
};

// Update an existing bank detail
exports.updateBankDetail = async (req, res) => {
  const bankDetailId = req.params.bankId;
  const updatedDetails = req.body;
  try {
    // Perform the update operation
    const result = await BankDetails.updateBankDetail(
      bankDetailId,
      updatedDetails
    );

    // If rows were affected, fetch the updated record
    if (result.affectedRows > 0) {
      // Fetch the updated record from the database
      const updatedBankDetail = await BankDetails.getBankDetailById(
        bankDetailId
      );

      // Send back the updated bank detail
      res.status(200).json({
        success: true,
        message: "Bank detail updated successfully.",
        data: updatedBankDetail,
      });
    } else {
      // If no rows were affected, return a message indicating no changes
      res.status(404).json({
        success: false,
        message: "No changes were made or the bank detail was not found.",
      });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Error updating bank detail",
      error: error.message,
    });
  }
};

// Delete a bank detail
exports.deleteBankDetail = async (req, res) => {
  const bankDetailId = req.params.bankId;
  try {
    const result = await BankDetails.deleteBankDetail(bankDetailId);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bank detail not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bank detail deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting bank detail",
      error: error.message,
    });
  }
};

// Get bank details by userId
exports.getBankDetailsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const bankDetails = await BankDetails.getBankDetailsByUserId(userId);
    if (bankDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No bank details found for userId: ${userId}`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Bank details retrieved successfully.",
      data: bankDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bank details",
      error: error.message,
    });
  }
};
