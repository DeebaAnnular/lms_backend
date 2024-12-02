const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Role =require("../models/role");
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
      //role = "employee",
      roleId, // New roleId field
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

    // Check if the emp_id already exists
    const existingEmpId = await User.findByEmpId(emp_id);
    if (existingEmpId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Check if the work_email already exists
    const existingUser = await User.findByEmail(work_email);
    if (existingUser) {
      return res.status(400).json({ message: "Work email already exists" });
    }

    // Check if the contact_number already exists
    const existingContactNumber = await User.findByContactNumber(
      contact_number
    );
    if (existingContactNumber) {
      return res.status(400).json({ message: "Contact number already exists" });
    }
    // Check if the roleId exists in the roleManagement table
    const roleExists = await Role.findById(roleId); // Assuming you have a method to check role existence
    if (!roleExists) {
      return res.status(400).json({ message: "Invalid roleId provided" });
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
      roleId,
    };

    await User.create(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
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
  const roleId = user.roleId;
  const gender = user.gender;

  res.json({ user_id, emp_name, emp_id, gender, roleId, email, token });
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
      user: "deebalakshmi2019@gmail.com",
      pass: "ubjxqcanhzdjavap",
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
      roleId: row.roleId,
      roleName: row.roleName, // Add this field
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
      roleId: rows[0].roleId,
    };

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const {
      emp_id,
      emp_name,
      gender,
      date_of_joining,
      contact_number,
      work_location,
      active_status,
      designation,
      roleId, // Corrected to use roleId
    } = req.body;

    // Validate and format date
    let formattedDate = date_of_joining;
    if (date_of_joining && date_of_joining.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = date_of_joining.split("-");
      formattedDate = `${year}-${month}-${day}`;
    } else if (
      date_of_joining &&
      !date_of_joining.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY.",
      });
    }

    // Get the current user details
    const [currentUser] = await User.getUserDetailsById(userId);
    if (!currentUser || currentUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare updated user data
    const updatedUser = {
      emp_id: emp_id || currentUser[0].emp_id,
      emp_name: emp_name || currentUser[0].emp_name,
      gender: gender || currentUser[0].gender,
      date_of_joining: formattedDate || currentUser[0].date_of_joining,
      contact_number: contact_number || currentUser[0].contact_number,
      work_location: work_location || currentUser[0].work_location,
      active_status:
        active_status !== undefined
          ? Number(active_status)
          : currentUser[0].active_status,
      designation: designation || currentUser[0].designation,
      roleId: roleId || currentUser[0].roleId, // Corrected to use roleId
    };

    // Check if the contact_number has changed
    if (contact_number && contact_number !== currentUser[0].contact_number) {
      // Check if the new contact_number already exists for another user
      const existingContactNumber = await User.findByContactNumber(
        contact_number
      );
      if (existingContactNumber && existingContactNumber.userId !== userId) {
        return res
          .status(400)
          .json({ message: "Contact number already exists for another user" });
      }
    }

    // Update user details in the database
    const updateResult = await User.updateUserDetails(userId, updatedUser);
    if (updateResult.success) {
      return res
        .status(200)
        .json({ message: "User details updated successfully" });
    } else {
      return res.status(400).json({ message: updateResult.message });
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    res
      .status(500)
      .json({ message: "Error updating user details", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.deleteUser(userId);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
