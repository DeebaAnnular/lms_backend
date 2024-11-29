const db = require("../config/db");

class Role {
  static async createRole(role) {
    // First, check if the roleName already exists
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM roleManagement
      WHERE roleName = ?
    `;

    const [result] = await db.query(checkQuery, [role.roleName]);

    // If the role already exists, return an error
    if (result[0].count > 0) {
      throw new Error("Role with this name already exists.");
    }

    // Proceed with inserting the new role if it doesn't exist
    const query = `
      INSERT INTO roleManagement 
      (roleName, apply, edit, deleteRole, approve, designation, salary, isActive, createdBy, createdOn, updatedBy, updatedOn) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      role.roleName,
      role.apply,
      role.edit,
      role.deleteRole,
      role.approve,
      role.designation,
      role.salary,
      role.isActive,
      role.createdBy,
      role.createdOn,
      role.updatedBy,
      role.updatedOn,
    ];

    return db.query(query, values);
  }

  // Get all roles
  static async getAllRoles() {
    const query = `SELECT * FROM roleManagement WHERE isActive = true`;

    try {
      // Query the database and ensure to get the rows
      const [rows] = await db.query(query); // This is for mysql2 and similar libraries

      // Log the rows to inspect the raw data
      console.log("Database rows:", rows);

      // Ensure we're returning the rows (actual data) and not some metadata
      return rows;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error; // Throw error to be handled in the controller
    }
  }

  // Get a role by roleName
  static async getRoleByName(roleName) {
    const query = `SELECT * FROM roleManagement WHERE roleName = ?`;
    return db.query(query, [roleName]);
  }
  // Method to update a role in the database
  static async updateRole(roleId, roleData) {
    const {
      roleName,
      apply,
      edit,
      deleteRole,
      approve,
      designation,
      salary,
      isActive,
      updatedBy,
      updatedOn,
    } = roleData; // Removed duplicate roleId from destructuring

    const query = `
    UPDATE roleManagement
    SET roleName = ?, apply = ?, edit = ?, deleteRole = ?, approve = ?, 
        designation = ?, salary = ?, isActive = ?, updatedBy = ?, updatedOn = ?
    WHERE id = ?`; // Corrected WHERE clause syntax

    const values = [
      roleName,
      apply,
      edit,
      deleteRole,
      approve,
      designation,
      salary,
      isActive,
      updatedBy,
      updatedOn,
      roleId, // roleId is now only used in the WHERE clause
    ];

    try {
      // Execute the update query
      const [result] = await db.query(query, values);

      // Check if no rows were affected
      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "Role not found or no changes made.",
        };
      }

      // Return the updated role data
      return {
        success: true,
        message: "Role updated successfully.",
        updatedRole: {
          roleId,
          roleName,
          apply,
          edit,
          deleteRole,
          approve,
          designation,
          salary,
          isActive,
          updatedBy,
          updatedOn,
        },
      };
    } catch (error) {
      console.error("Error updating role:", error);
      return {
        success: false,
        message: "An error occurred while updating the role.",
        error: error.message, // Provide detailed error message
      };
    }
  }

  // Delete a role by roleId
  static async deleteRole(roleId) {
    const query = `UPDATE roleManagement SET isActive = false WHERE id = ?`;
    try {
      // Execute the delete query
      const [result] = await db.query(query, [roleId]);

      // Check if a row was deleted
      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "Role not found or already deleted.",
        };
      }

      return { success: true, message: "Role deleted successfully." };
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error; // Throw error to be handled by the controller
    }
  }
  static async findById(roleId) {
    const query = "SELECT * FROM roleManagement WHERE id = ?";
    const [rows] = await db.query(query, [roleId]);
    return rows.length > 0 ? rows[0] : null; // Return the role if it exists, otherwise null
  }

  // Model method to get role by roleId
  static async getRoleById(roleId) {
    try {
      const query = `SELECT * FROM roleManagement WHERE id = ?`;
      const [rows] = await db.query(query, [roleId]);

      console.log("Query result for roleId:", roleId, rows); // Debug log

      // If rows are found, return the first row, otherwise return null
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error in getRoleById:", error);
      throw new Error("Error fetching role by ID.");
    }
  }

  // Get approved roles along with users assigned to those roles
  static async getApprovedRolesWithUsers() {
    const query = `
      SELECT r.id AS roleId, r.roleName, u.user_id, u.emp_name
      FROM roleManagement r
      INNER JOIN users u ON u.roleId = r.id
      WHERE r.approve = true;
    `;
    try {
      const [rows] = await db.query(query);

      // Log the result to inspect the data
      console.log("Approved Roles with Users:", rows);

      // Return the list of roles with the associated users
      return rows;
    } catch (error) {
      console.error("Error fetching approved roles with users:", error);
      throw error; // Rethrow the error to handle it in the controller
    }
  }
}

module.exports = Role;
