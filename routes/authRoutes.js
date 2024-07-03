const express = require("express");
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUserRole,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// pending work
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);
// **********************
router.get("/users", getAllUsers);
router.get("/user/:userId", getUserById);
router.put("/updateUserRole", updateUserRole);

module.exports = router;
