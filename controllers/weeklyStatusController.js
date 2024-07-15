const WeeklyStatus = require('../models/weeklyStatus');

exports.createWeeklyStatus = (req, res) => {
  const { user_id, from_date, to_date } = req.body;
  WeeklyStatus.create({ user_id, from_date, to_date }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Weekly status created', id: result.insertId });
  });
};

exports.updateWeeklyStatus = (req, res) => {
  const { id } = req.params;
  const { approved_status, approved_by, comment } = req.body;

  if (approved_status === false && !comment) {
    return res.status(400).json({ error: 'Comment is required when rejecting a status' });
  }

  WeeklyStatus.update(id, { approved_status, approved_by, comment }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ 
      message: approved_status ? 'Weekly status approved' : 'Weekly status rejected',
      comment: comment || null
    });
  });
};

exports.getWeeklyStatusRange = (req, res) => {
  const { user_id, start_date, end_date } = req.query;
  
  if (!user_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'user_id, start_date, and end_date are required' });
  }

  WeeklyStatus.getByUserAndDateRange(user_id, start_date, end_date, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};