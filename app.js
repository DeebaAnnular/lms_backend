const express = require("express");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveManagementRoutes");
const tasksRoutes = require("./routes/taskRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const assetRoutes = require("./routes/assetRoutes");
const accessCardRoute = require("./routes/accessCardRoutes");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();

const app = express();

// /etc/letsencrypt/live/lms-api.annularprojects.com/cert.pem

// ******************

// const sslOptions = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/lms-api.annularprojects.com/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/lms-api.annularprojects.com/fullchain.pem"
//   ),
// };

// const server = https.createServer(sslOptions, app);

// ******************

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/task", tasksRoutes);
app.use("/api/holiday", holidayRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/access_card", accessCardRoute);

const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// const express = require("express");
// const authRoutes = require("./routes/authRoutes");
// const leaveRoutes = require("./routes/leaveManagementRoutes");
// const tasksRoutes = require("./routes/taskRoutes");
// const holidayRoutes = require("./routes/holidayRoutes");
// const assetRoutes = require("./routes/assetRoutes");
// const accessCardRoute = require("./routes/accessCardRoutes");
// const cors = require("cors");

// require("dotenv").config();

// const app = express();

// // /etc/letsencrypt/live/lms-api.annularprojects.com/cert.pem

// const sslOptions = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/lms-api.annularprojects.com/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/lms-api.annularprojects.com/fullchain.pem"
//   ),
// };

// const server = https.createServer(sslOptions, app);

// app.use(express.json());
// app.use(cors());
// app.use("/api/auth", authRoutes);
// app.use("/api/leave", leaveRoutes);
// app.use("/api/task", tasksRoutes);
// app.use("/api/holiday", holidayRoutes);
// app.use("/api/assets", assetRoutes);
// app.use("/api/access_card", accessCardRoute);

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });