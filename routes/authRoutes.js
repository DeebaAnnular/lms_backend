const express = require("express");
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  getAllUsers,
 
  
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);






module.exports = router;
