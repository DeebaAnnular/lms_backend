const { format } = require("date-fns");
const RoleManagerHistory = require("../models/roleManagerHistoryModel"); // Import the Role model
exports.saveRoleManagerHistory = async (req, res) => {
  const {
    userId,
    effective_from,
    effectiveTill,
    IsActive,
    createdBy,
    rmUserId,
  } = req.body;

  // Validate required fields
  if (!userId || !effective_from || !rmUserId || !createdBy) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: userId, effective_from, rmUserId, createdBy.",
    });
  }

  try {
    // Call the save method from the RoleManagerHistory class
    const roleManagerHistoryId =
      await RoleManagerHistory.saveRoleManagerHistory(
        userId,
        effective_from,
        effectiveTill,
        IsActive,
        createdBy,
        rmUserId
      );

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Role Manager History saved successfully.",
      data: {
        id: roleManagerHistoryId,
        userId,
        effective_from,
        effectiveTill,
        IsActive,
        createdBy,
        rmUserId,
      },
    });
  } catch (error) {
    console.error("Error saving role manager history:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving role manager history",
      error: error.message,
    });
  }
};
exports.getRoleManagerHistoryByUserId = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL params

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter: userId",
    });
  }

  try {
    // Call the method to fetch role manager history for the given userId
    const roleManagerHistoryData =
      await RoleManagerHistory.getRoleManagerHistoryByUserId(userId);

    if (roleManagerHistoryData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No role manager history found for userId: ${userId}`,
      });
    }

    // Respond with the data
    return res.status(200).json({
      success: true,
      message: "Role Manager History retrieved successfully.",
      data: roleManagerHistoryData,
    });
  } catch (error) {
    console.error("Error fetching role manager history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching role manager history",
      error: error.message,
    });
  }
};
