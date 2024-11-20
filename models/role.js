const db = require("../config/db");

class Role {
  static async createRole(role) {
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
    const query = `SELECT * FROM roleManagement`;

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
    } = roleData;

    const query = `
    UPDATE roleManagement
    SET roleName = ?, apply = ?, edit = ?, deleteRole = ?, approve = ?, 
        designation = ?, salary = ?, isActive = ?, updatedBy = ?, updatedOn = ?
    WHERE roleId = ?`;

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
      roleId,
    ];

    try {
      // Execute the update query
      const [result] = await db.query(query, values);

      // Ensure to return an object with success if affectedRows is 0
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
        error: error.message,
      }; // Ensure that an object is always returned
    }
  }

  // Delete a role by roleId
  static async deleteRole(roleId) {
    const query = `DELETE FROM roleManagement WHERE roleId = ?`;

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
}

module.exports = Role;
