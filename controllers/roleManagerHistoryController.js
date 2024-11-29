const { format } = require("date-fns");
const RoleManagerHistory = require("../models/roleManagerHistoryModel"); // Import the Role model
exports.saveRoleManagerHistory = async (req, res) => {
  const { userId, effective_from, effectiveTill, IsActive, createdBy, roleId } =
    req.body;

  // Validate required fields
  if (!userId || !effective_from || !roleId || !createdBy) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: userId, effective_from, roleId, createdBy.",
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
        roleId
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
        roleId,
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
