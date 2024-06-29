const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/token");
const { hashPassword, comparePassword } = require("../utils/hash");

// const transporter = require('../config/mailer');

// exports.register = async (req, res) => {
//   const { email, password } = req.body;
//   const [user] = await User.findByEmail(email);
//   if (user.length) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   const hashedPassword = await hashPassword(password);
//   await User.create({ email, password: hashedPassword });
//   res.status(201).json({ message: "User registerd successfully" });
// };

// 

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
    console.log('Database query result:', existingUser);

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
  const emp_name = user.emp_name;
  const user_type =
    email === "selvagugan@annulartechnoloies.com" ? "approver" : "employee";

  res.json({ user_type, user_id, emp_name,email,  token });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const [user] = await User.findByEmail(email);
  if (!user.length) {
    return res.status(400).json({ message: "Email not found" });
  }
  const token = generateToken({ email: user[0].email });
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  const transporter = nodemailer.createTransport({
    //  service: "gmail",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "benisha.b@annulartechnologies.com",
      pass: "titpnrxooqgtxknt",
      //  user: "deebalakshmi2019@gmail.com",
      //  pass: "cdlzhewqdhkzswov"
    },
  });

  const mailOptions = {
    from: "benisha.b@annulartechnologies.com",
    to: email,
    subject: "Nodemailer Test",
    html: "hi everyoneyy https://mail.google.com",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.json({ message: "Password reset link sent to email" });
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
    const [users] = await User.getAllUsers();
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
    const [user] = await User.getUserDetailsById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
