const cron = require("node-cron"); // Import the cron module
const nodemailer = require("nodemailer");
const axios = require("axios");

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "benishabeni21@gmail.com", // Sender email
    pass: "xhdj ysor pzul otkj", // Use app password or email password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper function to format a date as "YYYY-MM-DD (Day)"
const formatDateWithDay = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
};

// Function to send notification email
const sendEmailNotification = (userEmail, missingDays) => {
  const formattedDays = missingDays.map((day) => formatDateWithDay(day));

  const mailOptions = {
    from: "benishabeni21@gmail.com", // Sender email
    to: userEmail, // Send to this email
    subject: "Task Update Reminder",
    text: `You haven't updated your tasks for the following days in the last 5 working days (Monday to Friday): Please ensure all tasks are saved.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Function to get the last working Monday to Friday
const getLastMondayToFriday = () => {
  const today = new Date();
  let lastMonday = new Date(today);
  lastMonday.setDate(
    today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
  ); // Get last Monday

  const lastFiveWorkingDays = [];
  for (let i = 0; i < 5; i++) {
    const currentDay = new Date(lastMonday);
    currentDay.setDate(lastMonday.getDate() + i);

    // Include only Monday to Friday
    const dayOfWeek = currentDay.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      lastFiveWorkingDays.push(currentDay.toISOString().split("T")[0]); // Save in YYYY-MM-DD format
    }
  }

  return lastFiveWorkingDays;
};

// Function to check for unupdated tasks
const checkForUnupdatedTasks = async () => {
  try {
    const usersResponse = await axios.get(
      "http://localhost:3005/api/auth/users"
    );
    const users = usersResponse.data;

    const lastFiveWorkingDays = getLastMondayToFriday(); // Get last working Monday to Friday

    for (const user of users) {
      const { user_Id, work_email } = user;

      if (!work_email) {
        console.log("No work email found for user:", user_Id);
        continue; // Skip users without email
      }

      const tasksResponse = await axios.get(
        `http://localhost:3005/api/task/get_all_tasks?user_id=${user_Id}`
      );
      const userTasks = tasksResponse.data; // Assuming this returns an array of task objects

      // Extract task dates
      const taskDates = userTasks.map((task) => task.task_date);

      // Find missing working days
      const missingDays = lastFiveWorkingDays.filter(
        (day) => !taskDates.includes(day)
      );

      if (missingDays.length > 0) {
        console.log(
          `User ${user_Id} has unupdated tasks on: ${missingDays
            .map(formatDateWithDay)
            .join(", ")}`
        );
        sendEmailNotification(work_email, missingDays); // Send email reminder with missing days
      }
    }
  } catch (error) {
    console.log("Error checking for unupdated tasks:", error.message);
  }
};

// // Schedule the job to run every minute (for testing purposes)
// cron.schedule("*/1 * * * *", () => {
//   console.log("Checking for unupdated tasks...");
//   checkForUnupdatedTasks();
// });
// Schedule the job to run every Sunday at 12 PM
cron.schedule("0 12 * * SUN", () => {
  console.log("Checking for unupdated tasks...");
  checkForUnupdatedTasks();
});
