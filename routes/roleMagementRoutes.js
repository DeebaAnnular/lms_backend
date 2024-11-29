const express = require("express");
const router = express.Router();

const {
  createRoleManagement,
  getAllRoles,
  updateRole,
  deleteRole,
  getRoleByRoleId,
  getApprovedRoles,
} = require("../controllers/roleManagementController");

// Route for creating a new role
router.post("/create_role", createRoleManagement);

// Route for getting all roles
router.get("/get_all_roles", getAllRoles);

router.put("/role/:roleId", updateRole);

router.delete("/roles/:roleId", deleteRole);

router.get("/getRoleByRoleId/:roleId", getRoleByRoleId);

router.get("/getApprovedRoles", getApprovedRoles);

module.exports = router;
