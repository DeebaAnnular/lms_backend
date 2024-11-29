const express = require("express");
const router = express.Router();

const {
  createBankDetail,
  updateBankDetail,
  deleteBankDetail,
  getBankDetailsByUserId,
} = require("../controllers/bankDetailsController");

// Route for creating a new bank detail
router.post("/createBankDetail", createBankDetail);

// Route for updating an existing bank detail
router.put("/updateBankDetail/:bankId", updateBankDetail);

// Route for deleting a bank detail
router.delete("/deleteBankDetail/:bankId", deleteBankDetail);

// Route for getting bank details by userId
router.get("/getBankDetailsByUserId/:userId", getBankDetailsByUserId);

module.exports = router;
