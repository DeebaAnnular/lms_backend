const express = require("express");
const router = express.Router();
const {
  createHolidayRequest,
  getAllHolidayRequests,
  getHolidayRequestById,
  deleteHolidayRequestById,
  updateHolidayRequestById,
  getOptionalHolidays,
  getCompulsoryHolidays
} = require("../controllers/holidayController");

router.post("/create_holiday", createHolidayRequest);
router.get("/get_all_holidays", getAllHolidayRequests);
router.get("/get_holiday_by_id/:id", getHolidayRequestById);
router.put("/update_holiday/:id", updateHolidayRequestById);
router.delete("/delete_holiday/:id", deleteHolidayRequestById);
router.get('/optional_holiday', getOptionalHolidays);
router.get('/compulsory_holiday',getCompulsoryHolidays);
module.exports = router;
