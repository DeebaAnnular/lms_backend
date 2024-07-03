const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/token");
const { hashPassword, comparePassword } = require("../utils/hash");

exports.register = async (req, res) => {
  try {
    let {
      emp_id,
      emp_name,
      gender,
      date_of_joining,
      contact_number,
      work_location,
      active_status,
      designation,
      personal_email,
      work_email,
      password,
      role = "employee",
    } = req.body;

    // Validate and format date
    if (date_of_joining.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = date_of_joining.split("-");
      date_of_joining = `${year}-${month}-${day}`;
    } else if (!date_of_joining.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY.",
      });
    }

    const existingUser = await User.findByEmail(work_email);
    console.log("Database query result:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "Work email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      emp_id,
      emp_name,
      gender,
      date_of_joining,
      contact_number,
      work_location,
      active_status: Boolean(active_status),
      designation,
      personal_email,
      work_email,
      password: hashedPassword,
      role,
    };

    console.log("User data to be inserted:", newUser);

    await User.create(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateRole(userId, newRole);
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ message: "Error updating user role", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: user.userId });
  const user_id = user.userId;
  const emp_name = user.empName;
  const emp_id = user.empId;
  const user_role = user.userRole;

  res.json({ user_id, emp_name, emp_id, user_role, email, token });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Email not found" });
  }
  const token = generateToken({ email: user.work_email });
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "benisha.b@annulartechnologies.com",
      pass: "titpnrxooqgtxknt",
    },
  });

  const mailOptions = {
    from: "benisha.b@annulartechnologies.com",
    to: email,
    subject: "Password Reset",
    html: `Click this link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ message: "Password reset link sent to email" });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  let payload;
  try {
    payload = verifyToken(token);
  } catch (e) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const hashedPassword = await hashPassword(newPassword);
  await User.updatePassword(payload.email, hashedPassword);
  res.json({ message: "Password reset successfully" });
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await User.getAllUsers();
    const users = rows.map((row) => ({
      user_id: row.user_id,
      emp_id: row.emp_id,
      emp_name: row.emp_name,
      gender: row.gender,
      date_of_joining: row.date_of_joining,
      contact_number: row.contact_number,
      work_location: row.work_location,
      active_status: row.active_status,
      designation: row.designation,
      role: row.role,
      work_email: row.work_email,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await User.getUserDetailsById(userId);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      user_id: rows[0].user_id,
      emp_id: rows[0].emp_id,
      emp_name: rows[0].emp_name,
      gender: rows[0].gender,
      date_of_joining: rows[0].date_of_joining,
      contact_number: rows[0].contact_number,
      work_location: rows[0].work_location,
      active_status: rows[0].active_status,
      designation: rows[0].designation,
      role: rows[0].role,
      work_email: rows[0].work_email,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at,
    };

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};
