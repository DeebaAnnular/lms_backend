const HolidayRequest = require("../models/holidayModal");
const { format } = require("date-fns");

exports.createHolidayRequest = async (req, res) => {
  try {
    const holidayRequest = req.body;

    // Format the date
    if (holidayRequest.date) {
      holidayRequest.date = format(new Date(holidayRequest.date), 'yyyy-MM-dd');
    }

    // Log the formatted holiday request before insertion
    console.log("Formatted holiday request before insertion:", holidayRequest);

    // Check if a holiday already exists on the given date
    const existingHoliday = await HolidayRequest.findByDate(holidayRequest.date);

    if (existingHoliday) {
      return res.status(400).json({ message: "Holiday already exists on this date." });
    }

    // Insert holiday request into the database
    const result = await HolidayRequest.create(holidayRequest);

    // Retrieve the inserted holiday to verify the date
    const holidayId = result.insertId;
    const insertedHoliday = await HolidayRequest.findById(holidayId);

    // Log the inserted holiday
    console.log("Inserted holiday from database:", insertedHoliday);

    if (!insertedHoliday) {
      return res.status(500).json({ message: "Failed to retrieve the inserted holiday." });
    }

    // Format the retrieved date if necessary
    if (insertedHoliday.date) {
      insertedHoliday.date = format(new Date(insertedHoliday.date), 'yyyy-MM-dd');
    }

    res.status(201).json(insertedHoliday);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHolidayRequests = async (req, res) => {
  try {
    const holidayRequests = await HolidayRequest.getAllHolidays();
    const formattedHolidayRequests = holidayRequests.map(holiday => ({
      ...holiday,
      date: format(new Date(holiday.date), 'yyyy-MM-dd')
    }));
    res.status(200).json(formattedHolidayRequests);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOptionalHolidays = async (req, res) => {
  try {
    const optionalHolidays = await HolidayRequest.getByHolidayType('optional_holidays');
    const formattedOptionalHolidays = optionalHolidays.map(holiday => ({
      ...holiday,
      date: format(new Date(holiday.date), 'yyyy-MM-dd')
    }));
    res.status(200).json(formattedOptionalHolidays);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCompulsoryHolidays = async (req, res) => {
  try {
    const compulsoryHolidays = await HolidayRequest.getByHolidayType('compulsory_holidays');
    const formattedCompulsoryHolidays = compulsoryHolidays.map(holiday => ({
      ...holiday,
      date: format(new Date(holiday.date), 'yyyy-MM-dd')
    }));
    res.status(200).json(formattedCompulsoryHolidays);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getHolidayRequestById = async (req, res) => {
  try {
    const holidayId = req.params.id;
    const holidayRequest = await HolidayRequest.getById(holidayId);
    if (!holidayRequest) {
      return res.status(404).json({ error: "Holiday request not found" });
    }
    // Format the date before sending response
    if (holidayRequest.date) {
      holidayRequest.date = format(new Date(holidayRequest.date), 'yyyy-MM-dd');
    }
    res.status(200).json(holidayRequest);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateHolidayRequestById = async (req, res) => {
  try {
    const holidayId = req.params.id;
    const holidayRequest = req.body;

    // Check if the holiday request exists
    const existingHoliday = await HolidayRequest.findById(holidayId);
    if (!existingHoliday) {
      return res.status(404).json({ message: "Holiday request not found" });
    }

    // Format the date if provided
    if (holidayRequest.date) {
      holidayRequest.date = format(new Date(holidayRequest.date), 'yyyy-MM-dd');
    }

    const result = await HolidayRequest.updateById(holidayId, holidayRequest);
    res.status(200).json({ message: "Holiday request updated successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.deleteHolidayRequestById = async (req, res) => {
  try {
    const holidayId = req.params.id;

    // Check if the holiday request exists
    const existingHoliday = await HolidayRequest.findById(holidayId);
    if (!existingHoliday) {
      return res.status(404).json({ message: "Holiday request not found" });
    }

    // Delete the holiday request
    await HolidayRequest.deleteById(holidayId);
    res.status(200).json({ message: "Holiday request deleted successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};