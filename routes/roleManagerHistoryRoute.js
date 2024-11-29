const express = require("express");
const router = express.Router();
const {
  saveRoleManagerHistory,
  getRoleManagerHistoryByUserId,
} = require("../controllers/roleManagerHistoryController");

// Route for creating a new role manager history record
router.post("/saveRoleManagerHistory", saveRoleManagerHistory);
router.get(
  "/getRoleManagerHistoryByUserId/:userId",
  getRoleManagerHistoryByUserId
);

module.exports = router; // Don't forget to export the router
