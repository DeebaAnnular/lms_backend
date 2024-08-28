const express = require("express");
const {
  createAccessCard,
  getAllAccessCards,
  getAccessCardById,
  updateAccessCard,
  deleteAccessCard,
} = require("../controllers/accessCardController");
const router = express.Router();

router.post("/create_access_card", createAccessCard);
router.get("/get_all_access_card", getAllAccessCards);
router.get("/get_access_card/:id", getAccessCardById);
router.put("/update_access_card/:id", updateAccessCard);
router.delete("/delete_access_card/:id", deleteAccessCard);
module.exports = router;
