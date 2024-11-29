const { format } = require("date-fns");
const Role = require("../models/role"); // Import the Role model

// Controller to create a new role
exports.createRoleManagement = async (req, res) => {
  const {
    roleName,
    apply,
    edit,
    deleteRole,
    approve,
    designation,
    salary,
    isActive,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
  } = req.body;

  // Validate the required fields
  // if (!roleName || !designation) {
  //   return res.status(400).json({
  //     message: "Role name and designation are required.",
  //   });
  // }

  // Create a new role object
  const newRole = {
    roleName,
    apply,
    edit,
    deleteRole,
    approve,
    designation,
    salary,
    isActive,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
  };

  try {
    // Call the createRole method from the Role model to insert the role into the database
    await Role.createRole(newRole);

    // Return a success response
    return res.status(201).json({
      message: "Role created successfully!",
      role: newRole,
    });
  } catch (error) {
    console.error("Error occurred while creating role:", error);
    return res.status(500).json({
      message: "An error occurred while creating the role.",
      error: error.message,
    });
  }
};

// Controller to get all roles
exports.getAllRoles = async (req, res) => {
  try {
    // Call the getAllRoles method from the Role model to fetch all roles
    const roles = await Role.getAllRoles();

    // Log the fetched data from the model to ensure correct data is returned
    console.log("Fetched roles from model:", roles);

    // Check if any roles were found
    if (roles.length === 0) {
      return res.status(404).json({
        message: "No roles found.",
      });
    }

    // Map the roles to clean them (if necessary) before returning
    const cleanRoles = roles.map((role) => {
      return {
        roleId: role.roleId, // Ensure roleId is inc
        roleName: role.roleName || null, // Fallback for missing values
        apply: role.apply || false,
        edit: role.edit || false,
        deleteRole: role.deleteRole || false,
        approve: role.approve || false,
        designation: role.designation || null,
        salary: role.salary || null,
        isActive: role.isActive || false,
        createdBy: role.createdBy || null,
        createdOn: role.createdOn || null,
        updatedBy: role.updatedBy || null,
        updatedOn: role.updatedOn || null,
      };
    });

    // Return a success response with the cleaned roles
    return res.status(200).json({
      message: "Roles fetched successfully.",
      roles: cleanRoles,
    });
  } catch (error) {
    console.error("Error occurred while fetching roles:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the roles.",
      error: error.message,
    });
  }
};

exports.updateRole = async (req, res) => {
  const { roleId } = req.params; // Role ID from URL parameters
  const roleData = req.body; // Role data from the request body

  try {
    // Call the updateRole method from the Role model
    const updatedRole = await Role.updateRole(roleId, roleData);

    // If the update didn't happen or was unsuccessful, return the response from updateRole
    if (!updatedRole || !updatedRole.success) {
      return res.status(404).json(updatedRole); // Return the error message from updateRole
    }

    // If successful, return the updated role data with a 200 status
    return res.status(200).json(updatedRole);
  } catch (error) {
    // Log and return a 500 status if an error occurs
    console.error("Error in updating role:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the role.",
      error: error.message,
    });
  }
};

// Controller method to delete a role by roleId
exports.deleteRole = async (req, res) => {
  const { roleId } = req.params; // Role ID from URL parameters

  try {
    // Call the deleteRole method from the Role model
    const deleteResponse = await Role.deleteRole(roleId);

    // If no rows are deleted, send a 404 response
    if (!deleteResponse.success) {
      return res.status(404).json(deleteResponse); // Return the error message
    }

    // If successful, send a success message with a 200 status
    return res.status(200).json(deleteResponse);
  } catch (error) {
    // Log and return a 500 status if an error occurs
    console.error("Error in deleting role:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the role.",
      error: error.message,
    });
  }
};

// Controller to get a role by roleId
exports.getRoleByRoleId = async (req, res) => {
  const { roleId } = req.params;

  try {
    // Ensure the roleId is a valid number (or adjust based on your database schema)
    if (!roleId || isNaN(roleId)) {
      return res.status(400).json({
        message: "Invalid roleId. Please provide a valid role ID.",
      });
    }

    // Fetch the role by roleId
    const role = await Role.getRoleById(roleId);

    // If the role is not found, return a 404 error
    if (!role) {
      return res.status(404).json({
        message: `Role with ID '${roleId}' not found.`,
      });
    }

    // Return the role if found
    return res.status(200).json({
      message: "Role retrieved successfully!",
      role,
    });
  } catch (error) {
    console.error("Error occurred while retrieving role:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the role.",
      error: error.message,
    });
  }
};
// Controller method for fetching approved roles
exports.getApprovedRoles = async (req, res) => {
  try {
    const approvedRoles = await Role.getApprovedRoles();
    return res.status(200).json({
      success: true,
      data: approvedRoles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching approved roles",
      error: error.message,
    });
  }
};
